# MEAT Documentation

Welcome to the internal documentation for **MEAT — Mitt Enhanced Application Toolkit**. This section covers architecture, usage patterns, plugin development, Vue integration, and testing setup.

---

## Contents

- [Architecture](#architecture)
- [Core State API](#core-state-api)
- [Event System](#event-system)
- [Plugin System](#plugin-system)
- [Logging & Debug](#logging--debug)
- [Persistence & Utilities](#persistence--utilities)
- [DOM Binding](#dom-binding)
- [Devtools](#devtools)
- [Core Config](#core-config)
- [Examples](#examples)
- [License](#license)

---

## Architecture

MEAT is a reactive state manager built on a scoped event bus. It allows precise updates to keys, plugin extension, DOM syncing, and optional Vue reactivity through composables. All core functionality is dependency-free.

- File: `src/meat.js`
- Global object: `window.meat`

---

## Core State API

- `getState()` – return a shallow copy of the current state object **(new)**
- `get(key)` – retrieve the value for a specific key
- `set(key, value)` – assign a value to a key and emit update events
- `setState(updates)` – batch-apply multiple key→value updates and emit events
- `merge(obj)` – alias for `setState()`
- `clear()` – remove all keys from state and emit clear events
- `reset()` – alias for `clear()`
- `serialize()` – return a JSON string of state (cached if unchanged)
- `dump()` – return the raw state object
- `isEmpty()` – return true if no keys are present
- `find(fn)` – return an array of keys for which `fn(key, value)` is true
- `inspectKey(key)` – return an object `{ value, watched }` for a given key
- `has(key)` – return true if the key exists in state
- `hasChanged(key, value)` – return true if the current value differs from provided
- `keys()` – return an array of all state keys
- `values()` – return an array of all state values
- `select(list)` – return an object of key→value pairs for the specified keys

### New Features

- `undo(key)` – restore the previous value for a given key **(new)**
- `rollback(key)` – alias for `undo(key)` **(new)**
- `rollbackAll()` – revert all keys to their previous values **(new)**
- `safe(fn)` – execute a function with automatic rollback on error **(new)**
- `historySnapshot()` – return a deep snapshot of all keys' mutation history **(new)**
- `logMessage(message, context)` – unified timestamped console logging **(new)**
- `lastModified()` – return the timestamp of the last state mutation **(new)**
- `changedKeys()` – return an array of keys modified since last reset **(new)**
- `freeze()` – disable direct state mutation **(new)**
- `thaw()` – enable direct state mutation **(new)**
- `configurable()` – log current configuration to console **(new)**

---

## Event System

- `subscribe(cb)` – listen to every state change; invokes `cb(initialState)` immediately
- `watch(key, cb)` – listen to changes on a specific key; invokes `cb(currentValue)` immediately
- `once(key, cb)` – listen only to the next change on a specific key
- `onAny(cb)` – wildcard listener for every internal event
- `unbindAll()` – remove all listeners from the event bus
- `on(type, cb)` – low-level event subscription for any custom event type
- `off(type, cb)` – remove a specific listener or all listeners for a type
- `emit(type, payload)` – emit a custom event with optional payload

---

## Plugin System

- `use(pluginFn, options)` – register a plugin function with optional config
- `unuse(pluginFn)` – invoke `cleanup()` on a plugin if provided

---

## Logging & Debug

- `debugLog(...args)` – internal debug logger (active if `config.debug`)
- `warn(code, detail)` – internal warning logger for errors and clashes
- `logMessage(message, context)` – unified timestamped console log **(new)**

---

## Persistence & Utilities

- `persist(key)` – save serialized state to `localStorage` under the given key
- `load(key)` – load and apply saved state from `localStorage`
- `dump()` – return the raw state object
- `bindToGlobal(name)` – attach the meat instance to `window[name]`
- `lastModified()` – return timestamp of the last state mutation **(new)**
- `changedKeys()` – return array of keys modified since load or reset **(new)**
- `freeze()` – set `config.mutable = false` to prevent direct mutation **(new)**
- `thaw()` – set `config.mutable = true` to allow direct mutation **(new)**
- `configurable()` – log the current plugin and state config object to console **(new)**

---

## DOM Binding

- `linkToDOM(selector, attr)` – bind serialized state to a DOM element’s attribute
- `unbindDOM()` – remove the DOM binding and cleanup listeners

---

## Devtools

- `devtools()` – print the current state object as a `console.table`

---

## Core Config

- `config` – `{ mutable: boolean, debug: boolean }`
- `pluginAccess` – `{ mode: "open" | "restricted" | "locked", whitelist: string[] | null }`
- `version` – version string (e.g. `"1.0.0-ribwich"`)

---

## Examples

- `/example/vue-example.vue` – Vue component using MEAT
- `/example/vanilla.html` – Plain HTML + MEAT integration

---

## License

MIT © Luciano Federico Pereira  
