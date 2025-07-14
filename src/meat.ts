type Listener<T = any> = (payload: T) => void;
type WildListener<T = any> = (type: string, payload: T) => void;
interface EventBus {
  on<T = any>(type: string, cb: Listener<T> | WildListener<T>): void;
  off<T = any>(type: string, cb?: Listener<T> | WildListener<T>): void;
  emit<T = any>(type: string, payload?: T): void;
  has(type: string): boolean;
  listeners(): string[];
}
type State = Record<string, any>;
interface Config {
  mutable: boolean;
  debug: boolean;
}
type PluginAPIOption = any;
type Plugin = (api: MeatAPI, options?: PluginAPIOption) => void;
interface MeatAPI {
  readonly config: Config;
  readonly pluginAccess: {
    mode: "open" | "restricted" | "locked";
    whitelist: string[] | null;
  };
  getState(): State;
  get<K extends string>(key: K): State[K];
  has(key: string): boolean;
  hasChanged<K extends string>(key: K, value: any): boolean;
  keys(): string[];
  values(): any[];
  select<T extends string>(keys: T[]): { [P in T]: State[P] };
  serialize(): string;
  set(key: string, value: any): void;
  setState(updates: Partial<State>): void;
  merge(updates: Partial<State>): void;
  clear(): void;
  reset(): void;
  subscribe(cb: Listener<State>): () => void;
  watch<K extends string>(key: K, cb: Listener<State[K]>): () => void;
  once<K extends string>(key: K, cb: Listener<State[K]>): void;
  onAny(cb: WildListener): () => void;
  unbindAll(): void;
  listeners(): string[];
  isWatched(type: string): boolean;
  on(type: string, cb: Listener<any> | WildListener): void;
  off(type: string, cb?: Listener<any> | WildListener): void;
  emit(type: string, payload?: any): void;
  use(plugin: Plugin, options?: PluginAPIOption): void;
  unuse(plugin: Plugin): void;
  version: string;
  devtools(): void;
  isEmpty(): boolean;
  find(fn: (key: string, value: any) => boolean): string[];
  inspectKey(key: string): { value: any; watched: boolean };
  bindToGlobal(name?: string): void;
  signal(key: string, value: any): void;
  listen(key: string, cb: Listener<any>): () => void;
  logState?(key: string): void;
  chronicle?(key: string): any[];
}
declare global {
  interface Window {
    meat: MeatAPI;
  }
}
(function () {
  const config: Config = { mutable: false, debug: false };
  const pluginAccess = {
    mode: "open" as const,
    whitelist: null as string[] | null
  };
  const debugLog = (...args: any[]) => config.debug && console.log("[MEAT]", ...args);
  const warn = (code: string, detail?: any) => console.warn(`[MEAT:${code}]`, detail ?? "");
  const eventBus: EventBus = (() => {
    const map = new Map<string, Array<Listener | WildListener>>();
    return {
      on(type, cb) {
        if (typeof cb !== "function") return;
        if (!map.has(type)) map.set(type, []);
        map.get(type)!.push(cb);
      },
      off(type, cb) {
        const list = map.get(type);
        if (!list) return;
        if (cb) {
          const idx = list.indexOf(cb);
          if (idx > -1) list.splice(idx, 1);
        } else {
          map.set(type, []);
        }
      },
      emit(type, payload?) {
        (map.get(type) || []).forEach(fn => {
          try { fn(payload); } catch (e) { warn("HANDLER_ERROR", e); }
        });
        (map.get("*") || []).forEach(fn => {
          try { (fn as WildListener)(type, payload); } catch (e) { warn("WILDCARD_ERROR", e); }
        });
      },
      has: t => map.has(t),
      listeners: () => Array.from(map.keys())
    };
  })();
  let state: State = Object.create(null);
  let prevStateRef: State | null = null;
  let cachedString = "";
  function getState(): State {
    return config.mutable ? state : { ...state };
  }
  function get(key: string): any {
    return state[key];
  }
  function has(key: string): boolean {
    return key in state;
  }
  function hasChanged(key: string, value: any): boolean {
    return state[key] !== value;
  }
  function keys(): string[] {
    return Object.keys(state);
  }
  function values(): any[] {
    return Object.values(state);
  }
  const selectCache = new WeakMap<string[], any>();
  function select(list: string[]): any {
    if (!Array.isArray(list)) return {};
    if (selectCache.has(list)) return selectCache.get(list);
    const result = Object.fromEntries(list.map(k => [k, state[k]]));
    selectCache.set(list, result);
    return result;
  }
  function serialize(): string {
    if (prevStateRef === state) return cachedString;
    cachedString = JSON.stringify(state);
    prevStateRef = state;
    return cachedString;
  }
  function emitStateChange(key: string, value: any) {
    const snap = getState();
    eventBus.emit(`meat:update:${key}`, value);
    eventBus.emit("meat:update", snap);
  }
  function set(key: string, value: any) {
    if (state[key] === value) return;
    state = config.mutable
      ? ((state[key] = value), state)
      : { ...state, [key]: value };
    emitStateChange(key, value);
    debugLog("set", key, value);
  }
  function setState(updates: Partial<State> = {}) {
    const changed = Object.keys(updates).filter(k => state[k] !== updates[k]);
    if (!changed.length) return;
    const next = config.mutable ? state : { ...state };
    changed.forEach(k => {
      next[k] = updates[k]!;
      eventBus.emit(`meat:update:${k}`, updates[k]);
      debugLog("update", k, updates[k]);
    });
    state = config.mutable ? next : { ...next };
    eventBus.emit("meat:update", getState());
  }
  function merge(obj: Partial<State>) {
    setState(obj);
  }
  function clear() {
    const all = keys();
    if (config.mutable) all.forEach(k => delete state[k]);
    else state = {};
    all.forEach(k => eventBus.emit(`meat:update:${k}`, undefined));
    eventBus.emit("meat:update", getState());
    debugLog("clear store");
  }
  function reset() {
    clear();
  }
  function subscribe(cb: Listener<State>): () => void {
    if (typeof cb !== "function") return () => {};
    eventBus.on("meat:update", cb);
    cb(getState());
    return () => eventBus.off("meat:update", cb);
  }
  function watch(key: string, cb: Listener<any>): () => void {
    if (typeof cb !== "function") return () => {};
    const name = `meat:update:${key}`;
    eventBus.on(name, cb);
    cb(get(key));
    return () => eventBus.off(name, cb);
  }
  function once(key: string, cb: Listener<any>) {
    if (typeof cb !== "function") return;
    const name = `meat:update:${key}`;
    const handler = (v: any) => {
      try { cb(v); } catch (e) { warn("ONCE_ERROR", e); }
      eventBus.off(name, handler);
    };
    eventBus.on(name, handler);
  }
  function onAny(cb: WildListener): () => void {
    if (typeof cb !== "function") return () => {};
    eventBus.on("*", cb);
    return () => eventBus.off("*", cb);
  }
  function unbindAll() {
    eventBus.listeners().forEach(type => eventBus.off(type));
    debugLog("unbind all");
  }
  function createPluginAPI(): MeatAPI {
    if (pluginAccess.mode === "open") return meat;
    if (pluginAccess.mode === "restricted" && Array.isArray(pluginAccess.whitelist)) {
      const obj: any = {};
      pluginAccess.whitelist.forEach(k => (obj[k] = (meat as any)[k]));
      return obj;
    }
    if (pluginAccess.mode === "locked") {
      return {
        getState, serialize,
        config: { ...config }
      } as any;
    }
    return meat;
  }
  const definedMethods = new Set<string>();
  const loadedPlugins = new Set<Plugin>();
  function use(plugin: Plugin, options?: PluginAPIOption) {
    if (typeof plugin !== "function" || loadedPlugins.has(plugin)) return;
    loadedPlugins.add(plugin);
    const before: Partial<MeatAPI> = {};
    (Object.keys(meat) as Array<keyof MeatAPI>).forEach(k => {
      before[k] = (meat as any)[k];
    });
    try {
      plugin(createPluginAPI(), options);
    } catch (err) {
      warn("PLUGIN_ERROR", err);
    }
    (Object.keys(meat) as Array<keyof MeatAPI>).forEach(k => {
      if (
        before.hasOwnProperty(k as string) &&
        (meat as any)[k] !== before[k] &&
        !definedMethods.has(k as string)
      ) {
        warn("PLUGIN_CLASH", `Method "${k}" overwritten by plugin`);
        definedMethods.add(k as string);
      }
    });
  }
  function unuse(plugin: Plugin) {
    if (plugin && typeof (plugin as any).cleanup === "function") {
      try { (plugin as any).cleanup(); } catch (e) { warn("PLUGIN_CLEANUP_FAIL", e); }
    }
  }
  const meat: MeatAPI = {
    config,
    pluginAccess,
    getState,
    get,
    has,
    hasChanged,
    keys,
    values,
    select,
    serialize,
    set,
    setState,
    merge,
    clear,
    reset,
    subscribe,
    watch,
    once,
    onAny,
    unbindAll,
    listeners: eventBus.listeners,
    isWatched: eventBus.has,
    on: eventBus.on,
    off: eventBus.off,
    emit: eventBus.emit,
    use,
    unuse,
    version: "1.0.0",
    devtools: () => console.table(getState()),
    isEmpty: () => keys().length === 0,
    find: (fn) => keys().filter(k => fn(k, state[k])),
    inspectKey: (key) => ({
      value: get(key),
      watched: eventBus.has(`meat:update:${key}`)
    }),
    bindToGlobal(name = "meat") {
      (window as any)[name] = meat;
    },
    signal: set,
    listen: (key, cb) => watch(key, cb)
  };
  Object.keys(meat).forEach(k => definedMethods.add(k));
  function persistPlugin(m: MeatAPI) {
    let lastMutation: number | null = null;
    const modified: string[] = [];
    function track(k: string, v: any) {
      lastMutation = Date.now();
      if (!modified.includes(k)) modified.push(k);
    }
    const origSet = m.set;
    m.set = (k, v) => { origSet(k, v); track(k, v); };
    const origSetState = m.setState;
    m.setState = (u) => {
      origSetState(u);
      Object.keys(u).forEach(k => track(k, u[k]!));
    };
    m.persist = (key = "meatState") => {
      try { localStorage.setItem(key, m.serialize()); }
      catch (e) { warn("PERSIST_FAIL", e); }
    };
    m.load = (key = "meatState") => {
      try {
        const raw = localStorage.getItem(key);
        const obj = raw ? JSON.parse(raw) : null;
        if (obj && typeof obj === "object") m.setState(obj);
      } catch (e) { warn("LOAD_FAIL", e); }
    };
    m.dump = () => m.getState();
    m.lastModified = () => lastMutation;
    m.changedKeys = () => [...modified];
    m.freeze = () => (m.config.mutable = false);
    m.thaw = () => (m.config.mutable = true);
    m.configurable = () => console.log("MEAT Config:", m.config);
  }
  function logStatePlugin(m: MeatAPI) {
    m.logState = (key: string) => {
      console.log(`[MEAT] initial ${key}:`, m.get(key));
      m.subscribe(s => console.log(`[MEAT] ${key}:`, s[key]));
    };
  }
  function chroniclePlugin(m: MeatAPI) {
    m.chronicle = (key: string) => {
      const history: any[] = [];
      m.watch(key, v => history.push(v));
      return history;
    };
  }
  function linkPlugin(m: MeatAPI, opts: { selector?: string; attr?: string } = {}) {
    m.linkToDOM = (selector, attr = "data-meat") => {
      const el = typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
      if (!el) return warn("DOM_BIND_FAIL", `No DOM matches "${selector}"`);
      let lastSnap: string | null = null;
      const stop = m.subscribe(() => {
        const snap = m.serialize();
        if (snap !== lastSnap) {
          el.setAttribute(attr, snap);
          lastSnap = snap;
        }
      });
      m.unbindDOM = () => { stop(); el.removeAttribute(attr); };
    };
    if (opts.selector) m.linkToDOM(opts.selector, opts.attr);
  }
  meat.use(persistPlugin);
  meat.use(logStatePlugin);
  meat.use(chroniclePlugin);
  meat.use(linkPlugin);
  meat.bindToGlobal();
})();
