;(function () {
  const config = { mutable: false, debug: false };
  const pluginAccess = { mode: "open", whitelist: null };
  const debugLog = (...args) => config.debug && console.log("[MEAT]", ...args);
  const warn     = (code, detail) => console.warn(`[MEAT:${code}]`, detail || "");
  const eventBus = (() => {
    const listeners = new Map();
    return {
      on(type, cb) {
        if (typeof cb !== "function") return;
        if (!listeners.has(type)) listeners.set(type, []);
        listeners.get(type).push(cb);
      },
      off(type, cb) {
        const list = listeners.get(type);
        if (!list) return;
        if (cb) {
          const idx = list.indexOf(cb);
          if (idx > -1) list.splice(idx, 1);
        } else {
          listeners.set(type, []);
        }
      },
      emit(type, payload) {
        (listeners.get(type) || []).forEach(fn => {
          try { fn(payload) } catch (e) { warn("HANDLER_ERROR", e) }
        });
        (listeners.get("*") || []).forEach(fn => {
          try { fn(type, payload) } catch (e) { warn("WILDCARD_ERROR", e) }
        });
      },
      has: t => listeners.has(t),
      listeners: () => [...listeners.keys()]
    };
  })();
  let state      = Object.create(null);
  let prevState  = null;
  let cachedJson = "";
  const getState = () => (config.mutable ? state : Object.assign({}, state));
  const get      = k => state[k];
  const has      = k => k in state;
  const hasChanged = (k, v) => state[k] !== v;
  const keys     = () => Object.keys(state);
  const values   = () => Object.values(state);
  const selectCache = new WeakMap();
  const select = arr => {
    if (!Array.isArray(arr)) return {};
    if (selectCache.has(arr)) return selectCache.get(arr);
    const out = Object.fromEntries(arr.map(k => [k, state[k]]));
    selectCache.set(arr, out);
    return out;
  };
  const serialize = () => {
    if (prevState === state) return cachedJson;
    cachedJson = JSON.stringify(state);
    prevState  = state;
    return cachedJson;
  };
  const emitStateChange = (k, v) => {
    const snapshot = getState();
    eventBus.emit(`meat:update:${k}`, v);
    eventBus.emit("meat:update", snapshot);
  };
  const set = (k, v) => {
    if (state[k] === v) return;
    state = config.mutable
      ? ((state[k] = v), state)
      : Object.assign({}, state, { [k]: v });
    emitStateChange(k, v);
    debugLog("set", k, v);
  };
  const setState = (updates = {}) => {
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
  const merge = obj => setState(obj);
  const clear = () => {
    const all = keys();
    if (config.mutable) all.forEach(k => delete state[k]);
    else state = {};
    all.forEach(k => eventBus.emit(`meat:update:${k}`, undefined));
    eventBus.emit("meat:update", getState());
    debugLog("clear store");
  };
  const reset = clear;
  const subscribe = cb => {
    if (typeof cb !== "function") return;
    eventBus.on("meat:update", cb);
    cb(getState());
    return () => eventBus.off("meat:update", cb);
  };
  const watch = (k, cb) => {
    if (typeof cb !== "function") return;
    const name = `meat:update:${k}`;
    eventBus.on(name, cb);
    cb(get(k));
    return () => eventBus.off(name, cb);
  };
  const once = (k, cb) => {
    if (typeof cb !== "function") return;
    const name = `meat:update:${k}`;
    const handler = v => {
      try { cb(v) } catch (e) { warn("ONCE_ERROR", e) }
      eventBus.off(name, handler);
    };
    eventBus.on(name, handler);
  };
  const onAny = cb => {
    if (typeof cb !== "function") return;
    eventBus.on("*", cb);
    return () => eventBus.off("*", cb);
  };
  const unbindAll = () => {
    eventBus.listeners().forEach(type => eventBus.off(type));
    debugLog("unbind all");
  };
  function createPluginAPI() {
    if (pluginAccess.mode === "open") return meat;
    if (pluginAccess.mode === "restricted" && Array.isArray(pluginAccess.whitelist)) {
      return Object.fromEntries(pluginAccess.whitelist.map(k => [k, meat[k]]));
    }
    if (pluginAccess.mode === "locked") {
      return {
        getState: meat.getState,
        serialize: meat.serialize,
        config: Object.assign({}, meat.config)
      };
    }
    return meat;
  }
  const definedMethods = new Set();
  const loadedPlugins  = new Set();
  function use(plugin, options = {}) {
    if (typeof plugin !== "function" || loadedPlugins.has(plugin)) return;
    loadedPlugins.add(plugin);
    const before = Object.assign({}, meat);
    try {
      plugin(createPluginAPI(), options);
    } catch (err) {
      warn("PLUGIN_ERROR", err);
    }
    Object.keys(meat).forEach(k => {
      if (before.hasOwnProperty(k) && meat[k] !== before[k] && !definedMethods.has(k)) {
        warn("PLUGIN_CLASH", `Method "${k}" overwritten by plugin`);
        definedMethods.add(k);
      }
    });
  }
  function unuse(plugin) {
    if (plugin && typeof plugin.cleanup === "function") {
      try { plugin.cleanup() } catch (e) { warn("PLUGIN_CLEANUP_FAIL", e) }
    }
  }
  const meat = {
    config, pluginAccess,
    getState, setState, get, set, has, hasChanged, keys, values, select,
    serialize, merge, clear, reset,
    subscribe, watch, once, onAny, unbindAll,
    listeners: eventBus.listeners, isWatched: eventBus.has,
    on: eventBus.on, off: eventBus.off, emit: eventBus.emit,
    use, unuse
  };
  Object.keys(meat).forEach(k => definedMethods.add(k));
  meat.signal = meat.set;
  meat.listen = (key, cb) => watch(key, cb);
  meat.bindToGlobal = name => { window[name || "meat"] = meat };
  function persistPlugin(m) {
    let lastTime = null;
    const modified = [];
    const track = (k, v) => {
      lastTime = Date.now();
      if (!modified.includes(k)) modified.push(k);
    };
    const origSet      = m.set;
    m.set             = (k, v) => { origSet(k, v); track(k, v) };
    const origSetState = m.setState;
    m.setState        = u => { origSetState(u); Object.keys(u).forEach(k => track(k, u[k])); };
    m.persist = key => { try { localStorage.setItem(key||"meatState", m.serialize()) } catch(e){ warn("PERSIST_FAIL",e) } };
    m.load    = key => {
      try {
        const raw = localStorage.getItem(key||"meatState"),
              obj = raw? JSON.parse(raw): null;
        if (obj && typeof obj==="object") m.setState(obj);
      } catch(e){ warn("LOAD_FAIL", e) }
    };
    m.dump         = () => m.getState();
    m.lastModified = () => lastTime;
    m.changedKeys  = () => [...modified];
    m.freeze       = () => (m.config.mutable = false);
    m.thaw         = () => (m.config.mutable = true);
    m.configurable = () => console.log("MEAT Config:", m.config);
  }
  function logStatePlugin(m) {
    m.logState = key => {
      console.log(`[MEAT] initial ${key}:`, m.get(key));
      m.subscribe(state => console.log(`[MEAT] ${key}:`, state[key]));
    };
  }
  function chroniclePlugin(m) {
    m.chronicle = key => {
      const history = [];
      m.watch(key, v => history.push(v));
      return history;
    };
  }
  function linkPlugin(m, opts = {}) {
    m.linkToDOM = (selector, attr="data-meat") => {
      const el = typeof selector==="string" ? document.querySelector(selector) : selector;
      if (!el) return warn("DOM_BIND_FAIL", `No DOM matches "${selector}"`);
      let lastSnap = null;
      const stop = m.subscribe(() => {
        const snap = m.serialize();
        if (snap !== lastSnap) {
          el.setAttribute(attr, snap);
          lastSnap = snap;
        }
      });
      m.unbindDOM = () => { stop(); el.removeAttribute(attr) };
    };
    if (opts.selector) m.linkToDOM(opts.selector, opts.attr);
  }
  meat.use(persistPlugin);
  meat.use(logStatePlugin);
  meat.use(chroniclePlugin);
  meat.use(linkPlugin);
  meat.bindToGlobal();
})();
