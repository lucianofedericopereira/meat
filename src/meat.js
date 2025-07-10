// MEAT — Mitt Enhanced Application Toolkit
// Reactive state manager with scoped event bus and plugin system

(function () {
  const config = {
    mutable: false, // If true, direct mutations are allowed
    debug: false     // Enables internal console logging
  };

  const log = (...args) => config.debug && console.log("[MEAT]", ...args);

  // Internal event bus to manage scoped listeners
  const eventBus = (() => {
    const all = new Map();

    return {
      on(type, handler) {
        const handlers = all.get(type);
        handlers ? handlers.push(handler) : all.set(type, [handler]);
      },
      off(type, handler) {
        const handlers = all.get(type);
        if (handlers) {
          handler
            ? handlers.splice(handlers.indexOf(handler) >>> 0, 1)
            : all.set(type, []);
        }
      },
      emit(type, payload) {
        if (all.has(type)) all.get(type).slice().forEach(fn => fn(payload));
        if (all.has("*")) all.get("*").slice().forEach(fn => fn(type, payload));
      },
      has(type) {
        return all.has(type);
      },
      listeners() {
        return [...all.keys()];
      }
    };
  })();

  // Core state container
  let state = Object.create(null);

  // State accessors
  const getState = () => ({ ...state });
  const get = key => state[key];
  const has = key => key in state;
  const hasChanged = (key, value) => state[key] !== value;
  const keys = () => Object.keys(state);
  const values = () => Object.values(state);
  const select = list => Object.fromEntries(list.map(k => [k, state[k]]));
  const serialize = () => JSON.stringify(state);

  // Emit updates if listeners exist
  const emitIfListening = (key, value) => {
    const base = "meat:update";
    eventBus.has(`${base}:${key}`) && eventBus.emit(`${base}:${key}`, value);
    eventBus.has(base) && eventBus.emit(base, getState());
  };

  // Update individual state key
  const set = (key, value) => {
    if (!hasChanged(key, value)) return;

    if (config.mutable) {
      state[key] = value;
    } else {
      state = { ...state, [key]: value };
    }

    emitIfListening(key, value);
    log("set", key, value);
  };

  // Update multiple state keys at once
  const setState = (obj = {}) => {
    let changed = false;
    let newState = config.mutable ? state : { ...state };

    for (const key in obj) {
      if (hasChanged(key, obj[key])) {
        newState[key] = obj[key];
        eventBus.has(`meat:update:${key}`) && eventBus.emit(`meat:update:${key}`, obj[key]);
        changed = true;
        log("update", key, obj[key]);
      }
    }

    if (changed) {
      state = config.mutable ? newState : { ...newState };
      eventBus.has("meat:update") && eventBus.emit("meat:update", getState());
    }
  };

  // Merge behavior alias
  const merge = obj => setState(obj);

  // Clear all state keys
  const clear = () => {
    const clearedKeys = keys();
    config.mutable
      ? clearedKeys.forEach(k => delete state[k])
      : (state = {});

    clearedKeys.forEach(k =>
      eventBus.has(`meat:update:${k}`) &&
      eventBus.emit(`meat:update:${k}`, undefined)
    );

    eventBus.has("meat:update") && eventBus.emit("meat:update", getState());
    log("clear store");
  };

  const reset = () => clear(); // Alias for clear()

  // Save state to localStorage
  const persist = (key = "meatState") => {
    try {
      localStorage.setItem(key, serialize());
      log("persist", key);
    } catch (e) {
      console.warn("MEAT persist failed:", e);
    }
  };

  // Load state from localStorage
  const load = (key = "meatState") => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && typeof saved === "object") setState(saved);
      log("load", key, saved);
    } catch (e) {
      console.warn("MEAT load failed:", e);
    }
  };

  // Subscribe to global state changes
  const subscribe = cb => {
    if (typeof cb === "function") {
      eventBus.on("meat:update", cb);
      cb(getState());
      return () => eventBus.off("meat:update", cb);
    }
  };

  // Watch a specific key
  const watch = (key, cb) => {
    if (typeof cb === "function") {
      const event = `meat:update:${key}`;
      eventBus.on(event, cb);
      cb(get(key));
      return () => eventBus.off(event, cb);
    }
  };

  // One-time listener for key
  const once = (key, cb) => {
    const wrapper = val => {
      cb(val);
      eventBus.off(`meat:update:${key}`, wrapper);
    };
    eventBus.on(`meat:update:${key}`, wrapper);
  };

  // Wildcard listener for any event
  const onAny = cb => {
    if (typeof cb === "function") {
      eventBus.on("*", cb);
      return () => eventBus.off("*", cb);
    }
  };

  // Remove all listeners
  const unbindAll = () => {
    eventBus.listeners().forEach(key => eventBus.off(key));
    log("unbind all");
  };

  // Bind state to DOM via attribute
  const linkToDOM = (selector, attr = "data-meat") => {
    const el = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!el) {
      console.warn(`linkToDOM: No DOM element matches "${selector}"`);
      return;
    }
    subscribe(newState => el.setAttribute(attr, serialize()));
  };

  // Plugin injector
  const use = (plugin, options = {}) => {
    if (typeof plugin === "function") {
      plugin(meat, options);
      log("plugin loaded");
    }
  };

  // Exported MEAT API
  const meat = {
    config,
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
    persist,
    load,
    subscribe,
    watch,
    once,
    onAny,
    unbindAll,
    linkToDOM,
    listeners: eventBus.listeners,
    isWatched: eventBus.has,
    on: eventBus.on,
    off: eventBus.off,
    emit: eventBus.emit,
    use
  };

  window.meat = meat;
})();
