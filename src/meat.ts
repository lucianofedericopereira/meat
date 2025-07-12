type State = Record<string, any>;
type Listener = (data: any) => void;
type WildcardListener = (type: string, data: any) => void;
type Plugin = (api: MeatAPI, options?: any) => void;

interface MeatAPI {
  config: typeof config;
  pluginAccess: typeof pluginAccess;
  getState(): State;
  setState(updates: Partial<State>): void;
  get(key: string): any;
  set(key: string, value: any): void;
  has(key: string): boolean;
  hasChanged(key: string, value: any): boolean;
  keys(): string[];
  values(): any[];
  select(keys: string[]): State;
  serialize(): string;
  merge(obj: Partial<State>): void;
  clear(): void;
  reset(): void;
  subscribe(cb: Listener): () => void;
  watch(key: string, cb: Listener): () => void;
  once(key: string, cb: Listener): void;
  onAny(cb: WildcardListener): () => void;
  unbindAll(): void;
  listeners(): string[];
  isWatched(type: string): boolean;
  on(type: string, cb: Listener): void;
  off(type: string, cb?: Listener): void;
  emit(type: string, payload: any): void;
  use(plugin: Plugin, options?: any): void;
  unuse(plugin: Plugin): void;

  // Extensions
  version: string;
  devtools(): void;
  isEmpty(): boolean;
  find(fn: (key: string, value: any) => boolean): string[];
  inspectKey(key: string): { value: any; watched: boolean };
  persist?(key?: string): void;
  load?(key?: string): void;
  linkToDOM?(selector: string | Element, attr?: string): void;
  unbindDOM?(): void;
  dump(): State;
  bindToGlobal(name?: string): void;
  lastModified(): number | null;
  changedKeys(): string[];
  freeze(): void;
  thaw(): void;
  configurable(): void;
}

const config = { mutable: false, debug: false };
const pluginAccess = { mode: "open" as "open" | "restricted" | "locked", whitelist: null };

const debugLog = (...args: any[]) => config.debug && console.log("[MEAT]", ...args);
const warn = (code: string, detail?: any) => console.warn(`[MEAT:${code}]`, detail || "");

const listenersMap = new Map<string, Listener[]>();
const eventBus = {
  on(type: string, cb: Listener) {
    if (!listenersMap.has(type)) listenersMap.set(type, []);
    listenersMap.get(type)!.push(cb);
  },
  off(type: string, cb?: Listener) {
    const list = listenersMap.get(type);
    if (!list) return;
    if (cb) list.splice(list.indexOf(cb), 1);
    else listenersMap.set(type, []);
  },
  emit(type: string, payload: any) {
    (listenersMap.get(type) || []).forEach(cb => { try { cb(payload); } catch (e) { warn("HANDLER_ERROR", e); } });
    (listenersMap.get("*") || []).forEach(cb => { try { (cb as WildcardListener)(type, payload); } catch (e) { warn("WILDCARD_ERROR", e); } });
  },
  has: (type: string) => listenersMap.has(type),
  listeners: () => [...listenersMap.keys()]
};

let state: State = Object.create(null);
let prevStateRef: State | null = null;
let cachedString = "";
let lastMutationTime: number | null = null;
let modifiedKeys: string[] = [];

const getState = () => config.mutable ? state : Object.assign({}, state);
const get = (k: string) => state[k];
const has = (k: string) => k in state;
const hasChanged = (k: string, v: any) => state[k] !== v;
const keys = () => Object.keys(state);
const values = () => Object.values(state);

const selectCache = new WeakMap<string[], State>();
const select = (list: string[]) => {
  if (selectCache.has(list)) return selectCache.get(list)!;
  const result = Object.fromEntries(list.map(k => [k, state[k]]));
  selectCache.set(list, result);
  return result;
};

const serialize = (): string => {
  if (prevStateRef === state) return cachedString;
  cachedString = JSON.stringify(state);
  prevStateRef = state;
  return cachedString;
};

const emitStateChange = (key: string, value: any) => {
  const snap = getState();
  eventBus.emit(`meat:update:${key}`, value);
  eventBus.emit("meat:update", snap);
};

const trackMutation = (key: string, value: any) => {
  lastMutationTime = Date.now();
  if (!modifiedKeys.includes(key)) modifiedKeys.push(key);
};

const originalSet = (key: string, value: any) => {
  if (state[key] === value) return;
  state = config.mutable ? (state[key] = value, state) : { ...state, [key]: value };
  emitStateChange(key, value);
  debugLog("set", key, value);
};
const set = (key: string, value: any) => {
  originalSet(key, value);
  trackMutation(key, value);
};

const originalSetState = (updates: Partial<State>) => {
  const changed = Object.keys(updates).filter(k => state[k] !== updates[k]);
  if (!changed.length) return;
  const next = config.mutable ? state : Object.assign({}, state);
  changed.forEach(k => {
    next[k] = updates[k];
    eventBus.emit(`meat:update:${k}`, updates[k]);
    debugLog("update", k, updates[k]);
  });
  state = config.mutable ? next : Object.assign({}, next);
  eventBus.emit("meat:update", getState());
};
const setState = (updates: Partial<State>) => {
  originalSetState(updates);
  Object.keys(updates).forEach(k => trackMutation(k, updates[k]));
};

const merge = (obj: Partial<State>) => setState(obj);
const clear = () => {
  const cleared = keys();
  if (config.mutable) cleared.forEach(k => delete state[k]);
  else state = {};
  cleared.forEach(k => eventBus.emit(`meat:update:${k}`, undefined));
  eventBus.emit("meat:update", getState());
  debugLog("clear store");
};
const reset = () => clear();
const subscribe = (cb: Listener) => {
  eventBus.on("meat:update", cb);
  cb(getState());
  return () => eventBus.off("meat:update", cb);
};
const watch = (key: string, cb: Listener) => {
  const name = `meat:update:${key}`;
  eventBus.on(name, cb);
  cb(get(key));
  return () => eventBus.off(name, cb);
};
const once = (key: string, cb: Listener) => {
  const name = `meat:update:${key}`;
  const handler = (v: any) => { cb(v); eventBus.off(name, handler); };
  eventBus.on(name, handler);
};
const onAny = (cb: WildcardListener) => {
  eventBus.on("*", cb);
  return () => eventBus.off("*", cb);
};
const unbindAll = () => {
  eventBus.listeners().forEach(type => eventBus.off(type));
  debugLog("unbind all");
};

const definedMethods = new Set<string>();
const loadedPlugins = new Set<Plugin>();
const use = (plugin: Plugin, options: any = {}) => {
  if (loadedPlugins.has(plugin)) return;
  loadedPlugins.add(plugin);
  const before = Object.keys(meat);
  plugin(meat, options);
  const after = Object.keys(meat);
  after.forEach(k => {
    if (before.includes(k) && !definedMethods.has(k)) {
      warn("PLUGIN_CLASH", `Method "${k}" overwritten by plugin`);
      definedMethods.add(k);
    }
  });
};
const unuse = (plugin: Plugin) => {
  if ((plugin as any).cleanup) {
    try { (plugin as any).cleanup(); } catch (e) { warn("PLUGIN_CLEANUP_FAIL", e); }
  }
};
const meat: MeatAPI = {
  config,
  pluginAccess,
  getState,
  setState,
  get,
  set,
  has,
  hasChanged,
  keys,
  values,
  select,
  serialize,
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
  dump: () => getState(),
  bindToGlobal: (name = "meat") => {
    (window as any)[name] = meat;
  },
  lastModified: () => lastMutationTime,
  changedKeys: () => [...modifiedKeys],
  freeze: () => { config.mutable = false; },
  thaw: () => { config.mutable = true; },
  configurable: () => {
    console.log("MEAT Config:", config);
  }
};
