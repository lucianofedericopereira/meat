// MEAT — Mitt Enhanced Application Toolkit (TypeScript Edition)

type Listener = (payload: any) => void;

class EventBus {
  private listeners = new Map<string, Listener[]>();

  on(type: string, handler: Listener) {
    const handlers = this.listeners.get(type) ?? [];
    this.listeners.set(type, [...handlers, handler]);
  }

  off(type: string, handler?: Listener) {
    if (!this.listeners.has(type)) return;
    if (!handler) {
      this.listeners.set(type, []);
    } else {
      const filtered = this.listeners
        .get(type)!
        .filter(fn => fn !== handler);
      this.listeners.set(type, filtered);
    }
  }

  emit(type: string, payload: any) {
    this.listeners.get(type)?.slice().forEach(fn => fn(payload));
    this.listeners.get("*")?.slice().forEach(fn => fn(type, payload));
  }

  has(type: string): boolean {
    return this.listeners.has(type);
  }

  all(): string[] {
    return Array.from(this.listeners.keys());
  }
}

class MeatStore {
  config = {
    mutable: false,
    debug: false
  };

  private state: Record<string, any> = {};
  private bus = new EventBus();

  private log(...args: any[]) {
    if (this.config.debug) {
      console.log("[MEAT]", ...args);
    }
  }

  getState() {
    return { ...this.state };
  }

  get(key: string) {
    return this.state[key];
  }

  set(key: string, value: any) {
    if (this.state[key] === value) return;
    this.state = this.config.mutable
      ? Object.assign(this.state, { [key]: value })
      : { ...this.state, [key]: value };
    this.emitUpdate(key, value);
    this.log("set", key, value);
  }

  setState(obj: Record<string, any>) {
    let changed = false;
    let newState = this.config.mutable ? this.state : { ...this.state };

    for (const key in obj) {
      if (newState[key] !== obj[key]) {
        newState[key] = obj[key];
        this.bus.emit(`meat:update:${key}`, obj[key]);
        changed = true;
        this.log("update", key, obj[key]);
      }
    }

    if (changed) {
      this.state = this.config.mutable ? newState : { ...newState };
      this.bus.emit("meat:update", this.getState());
    }
  }

  merge(obj: Record<string, any>) {
    this.setState(obj);
  }

  clear() {
    for (const key of Object.keys(this.state)) {
      this.bus.emit(`meat:update:${key}`, undefined);
    }
    this.state = {};
    this.bus.emit("meat:update", this.getState());
    this.log("clear store");
  }

  reset() {
    this.clear();
  }

  serialize(): string {
    return JSON.stringify(this.state);
  }

  persist(key = "meatState") {
    try {
      localStorage.setItem(key, this.serialize());
      this.log("persist", key);
    } catch (e) {
      console.warn("MEAT persist failed:", e);
    }
  }

  load(key = "meatState") {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      this.setState(saved);
      this.log("load", key, saved);
    } catch (e) {
      console.warn("MEAT load failed:", e);
    }
  }

  subscribe(key: string, handler: Listener) {
    this.bus.on(`meat:update:${key}`, handler);
    handler(this.get(key));
    return () => this.bus.off(`meat:update:${key}`, handler);
  }

  watch(key: string, handler: Listener) {
    return this.subscribe(key, handler);
  }

  once(key: string, handler: Listener) {
    const wrapper = (val: any) => {
      handler(val);
      this.bus.off(`meat:update:${key}`, wrapper);
    };
    this.bus.on(`meat:update:${key}`, wrapper);
  }

  onAny(handler: (type: string, payload: any) => void) {
    this.bus.on("*", handler);
    return () => this.bus.off("*", handler);
  }

  linkToDOM(selector: string | Element, attr = "data-meat") {
    const el =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    if (!el) {
      console.warn(`linkToDOM: No element matches "${selector}"`);
      return;
    }
    this.bus.on("meat:update", () =>
      el.setAttribute(attr, this.serialize())
    );
  }

  use(plugin: (meat: MeatStore, options?: Record<string, any>) => void, options: Record<string, any> = {}) {
    plugin(this, options);
    this.log("plugin loaded");
  }

  on(type: string, handler: Listener) {
    this.bus.on(type, handler);
  }

  off(type: string, handler?: Listener) {
    this.bus.off(type, handler);
  }

  emit(type: string, payload: any) {
    this.bus.emit(type, payload);
  }

  listeners() {
    return this.bus.all();
  }

  isWatched(key: string): boolean {
    return this.bus.has(`meat:update:${key}`);
  }
}

const meat = new MeatStore();
export default meat;
