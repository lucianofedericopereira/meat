;(function () {
  const config = { mutable: false, debug: false };
  const pluginAccess = {
    mode: "open",
    whitelist: null
  };
  const debugLog = (...args) => config.debug && console.log("[MEAT]", ...args);
  const warn = (code, detail) => console.warn(`[MEAT:${code}]`, detail || "");
  const eventBus = (() => {
    const listenersMap = new Map();
    return {
      on(type, cb) {
        if (typeof cb !== "function") return;
        if (!listenersMap.has(type)) listenersMap.set(type, []);
        listenersMap.get(type).push(cb);
      },
      off(type, cb) {
        const list = listenersMap.get(type);
        if (!list) return;
        if (cb) {
          const i = list.indexOf(cb);
          if (i > -1) list.splice(i, 1);
        } else {
          listenersMap.set(type, []);
        }
      },
      emit(type, payload) {
        const list = listenersMap.get(type);
        if (list) {
          for (let i = 0; i < list.length; i++) {
            try { list[i](payload); } catch (e) { warn("HANDLER_ERROR", e); }
          }
        }
        const wild = listenersMap.get("*");
        if (wild) {
          for (let i = 0; i < wild.length; i++) {
            try { wild[i](type, payload); } catch (e) { warn("WILDCARD_ERROR", e); }
          }
        }
      },
      has: t => listenersMap.has(t),
      listeners: () => [...listenersMap.keys()]
    };
  })();
  let state = Object.create(null);
  let prevStateRef = null;
  let cachedString = "";
  const getState = () => config.mutable ? state : Object.assign({}, state);
  const get = k => state[k];
  const has = k => k in state;
  const hasChanged = (k, v) => state[k] !== v;
  const keys = () => Object.keys(state);
  const values = () => Object.values(state);
  const selectCache = new WeakMap();
  const select = list => {
    if (!Array.isArray(list)) return {};
    if (selectCache.has(list)) return selectCache.get(list);
    const result = Object.fromEntries(list.map(k => [k, state[k]]));
    selectCache.set(list, result);
    return result;
  };
  const serialize = () => {
    if (prevStateRef === state) return cachedString;
    cachedString = JSON.stringify(state);
    prevStateRef = state;
    return cachedString;
  };
  const emitStateChange = (key, value) => {
    const snap = getState();
    eventBus.emit(`meat:update:${key}`, value);
    eventBus.emit("meat:update", snap);
  };
  const set = (key, value) => {
    if (state[key] === value) return;
    state = config.mutable
      ? (state[key] = value, state)
      : { ...state, [key]: value };
    emitStateChange(key, value);
    debugLog("set", key, value);
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
    const cleared = keys();
    if (config.mutable) {
      cleared.forEach(k => delete state[k]);
    } else {
      state = {};
    }
    cleared.forEach(k => eventBus.emit(`meat:update:${k}`, undefined));
    eventBus.emit("meat:update", getState());
    debugLog("clear store");
  };
  const reset = () => clear();
  const subscribe = cb => {
    if (typeof cb !== "function") return;
    eventBus.on("meat:update", cb);
    cb(getState());
    return () => eventBus.off("meat:update", cb);
  };
  const watch = (key, cb) => {
    if (typeof cb !== "function") return;
    const name = `meat:update:${key}`;
    eventBus.on(name, cb);
    cb(get(key));
    return () => eventBus.off(name, cb);
  };
  const once = (key, cb) => {
    if (typeof cb !== "function") return;
    const name = `meat:update:${key}`;
    const handler = v => {
      try { cb(v); } catch (e) { warn("ONCE_ERROR", e); }
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
  const createPluginAPI = () => {
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
  };
  const definedMethods = new Set();
  const loadedPlugins = new Set();
  const use = (plugin, options = {}) => {
    if (typeof plugin !== "function" || loadedPlugins.has(plugin)) return;
    loadedPlugins.add(plugin);
    try {
      const before = Object.keys(meat);
      plugin(createPluginAPI(), options);
      const after = Object.keys(meat);
      after.forEach(k => {
        if (before.includes(k) && !definedMethods.has(k)) {
          warn("PLUGIN_CLASH", `Method "${k}" overwritten by plugin`);
          definedMethods.add(k);
        }
      });
    } catch (e) {
      warn("PLUGIN_ERROR", e);
    }
  };
  const unuse = plugin => {
    if (typeof plugin.cleanup === "function") {
      try { plugin.cleanup(); } catch (e) { warn("PLUGIN_CLEANUP_FAIL", e); }
    }
  };
  const meat = {
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
    unuse
  };
  meat.version = "1.0.0";
  meat.devtools = () => {
    console.table(getState());
  };
  meat.isEmpty = () => {
    return keys().length === 0;
  };
  meat.find = (fn) => {
    return keys().filter(k => fn(k, state[k]));
  };
  meat.inspectKey = (key) => {
    return {
      value: get(key),
      watched: eventBus.has(`meat:update:${key}`)
    };
  };
  const persistPlugin = meat => {
    meat.persist = (key = "meatState") => {
      try {
        localStorage.setItem(key, meat.serialize());
        meat.config.debug && console.log("[MEAT] persist", key);
      } catch (e) {
        warn("PERSIST_FAIL", e);
      }
    };
    meat.load = (key = "meatState") => {
      try {
        const raw = localStorage.getItem(key);
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          meat.setState(saved);
          meat.config.debug && console.log("[MEAT] load", key, saved);
        }
      } catch (e) {
        warn("LOAD_FAIL", e);
      }
    };
    meat.dump = () => {
      return getState();
    };
    meat.bindToGlobal = (name = "meat") => {
      window[name] = meat;
    };
    let lastMutationTime = null;
    let modifiedKeys = [];
    const trackMutation = (key, value) => {
      lastMutationTime = Date.now();
      if (!modifiedKeys.includes(key)) {
        modifiedKeys.push(key);
      }
    };
    const originalSet = set;
    set = (key, value) => {
      originalSet(key, value);
      trackMutation(key, value);
    };
    meat.set = set;
    const originalSetState = setState;
    setState = (updates = {}) => {
      originalSetState(updates);
      Object.keys(updates).forEach(k => trackMutation(k, updates[k]));
    };
    meat.setState = setState;
    meat.lastModified = () => lastMutationTime;
    meat.changedKeys = () => [...modifiedKeys];
    meat.freeze = () => (config.mutable = false);
    meat.thaw = () => (config.mutable = true);
    meat.configurable = () => {
      console.log("MEAT Config:", config);
    };
  };
  const linkPlugin = (meat, options = {}) => {
    meat.linkToDOM = (selector, attr = "data-meat") => {
      const el = typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
      if (!el) return warn("DOM_BIND_FAIL", `No DOM matches "${selector}"`);
      if (!meat.serialize || !meat.subscribe) {
        return warn("ACCESS_DENIED", "Missing serialize/subscribe");
      }
      let lastSnapshot;
      const stop = meat.subscribe(() => {
        const snapshot = meat.serialize();
        if (snapshot !== lastSnapshot) {
          el.setAttribute(attr, snapshot);
          lastSnapshot = snapshot;
        }
      });
      meat.unbindDOM = () => {
        stop();
        el.removeAttribute(attr);
      };
    };
    if (options.selector) {
      meat.linkToDOM(options.selector, options.attr);
    }
  };
  meat.use(persistPlugin);
  meat.use(linkPlugin);
  meat.bindToGlobal();
})();
