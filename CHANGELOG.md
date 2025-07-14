# Changelog

All notable changes to MEAT will be documented in this file.

# [1.B1] — Bugfix Release

**Released: July 15, 2025**

### 🐞 Fixes

- Persistence plugin now only wraps the **public** methods (`meat.set` / `meat.setState`) — no more “invalid assignment to const” errors.  
- `use()` warnings only fire on *actual* method overwrites (no more PLUGIN_CLASH spam).  
- Restored aliases and APIs for backwards-compat:  
  - `meat.bindToGlobal()`  
  - `meat.signal()`  
  - `meat.listen()`  
  - `meat.logState()`  
  - `meat.chronicle()`

---

## [1.B0] — Ribwich Edition

> “We only sell the Ribwich for a limited time... and this release’s spicy.”

### 🍖 Core

- `bindToGlobal()`, `freeze()`, `thaw()`, `configurable()`
- Utility methods: `dump()`, `find()`, `inspectKey()`, `isEmpty()`, `lastModified()`, `changedKeys()`
- Unified `logMessage()` injector for scoped, timestamped console output

### 🔌 Plugin: MeatChronicle

Single plugin, many powers:

- ⏪ Timeline per key with undo + rollback
- 🔁 Rollback all keys with `meat.rollbackAll()`
- 🧯 Protected execution via `meat.safe(fn)`
- 🧠 Tagged mutation history with source + timestamp
- 🔍 Introspectors: `getHistory()`, `historySnapshot()`, `changedKeys()`
- 📊 Console logger: `logHistory(key)`
- 🔐 Fully listener-based — no monkey-patching
- ⚙️ Compatible with all framework adapters

> No external checkpoint or persistence plugins required — everything flows through Chronicle.

### 🧩 Framework Support

- ✅ Vue 3 via `meatVuePlugin`, `useMeat`
- ✅ Laravel via Blade macros, middleware, and Livewire
- ✅ Alpine, Astro, Nuxt, Next, React, Qwik, Solid, Svelte
- 🧪 Angular stub adapter ready

Released: July 13, 2025  
Codename: **Ribwich Edition**

---

## [1.A1] — Initial Release

### 🔥 Features

- Core state engine (`set`, `get`, `setState`, etc.)
- Scoped event bus with `watch`, `subscribe`, and `once`
- Optional immutability (`mutable: false`)
- DOM binding via `linkToDOM()`
- LocalStorage persistence (`persist`, `load`)
- Plugin system (`use(plugin)`)
- Vue 3 integration via `meatVuePlugin` and `useMeat`
- Vanilla JS demo + Vue example app
- Tests for state, plugins, and Vue hooks

Released: July 10, 2025

