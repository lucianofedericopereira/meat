# 🥩 MEAT

**Mitt Enhanced Application Toolkit**  

![MEAT Mascot](./assets/a1.png)

Minimal reactive state system with plugin support, Vue composables, and zero dependencies.

One API, ten frameworks, zero stress. MEAT plugs into Alpine, Angular, Astro, Nuxt, Next.js, React, Qwik, Solid, Svelte, and Vue — saving your bacon across the board.

![Version](https://img.shields.io/badge/version-1.B0-ribwich)
![Open Source](https://img.shields.io/badge/license-MIT-blue)
![Code Size](https://img.shields.io/github/languages/code-size/lucianofedericopereira/meat)
![Contributions](https://img.shields.io/badge/contributions-open-brightgreen)
![Author](https://img.shields.io/badge/made%20by-Luciano%20Federico%20Pereira-blue)
[📘 MEAT Handbook](https://lucianofedericopereira.github.io/the-meat-handbook/)


## 📘 Handbook

For deep dives into MEAT’s architecture, patterns, and plugin system, see:

**🧠 The MEAT Handbook**  
A signal-first architecture reference by Luciano F. Pereira.  
→ [Download PDF](https://github.com/lucianofedericopereira/the-meat-handbook/raw/main/export/v1/the-meat-handbook.pdf)  
→ [Download EPUB](https://github.com/lucianofedericopereira/the-meat-handbook/raw/main/export/v1/the-meat-handbook.epub)  

---

**1.B1 — Bugfix Release**

- Persistence plugin now only wraps the **public** methods (`meat.set` / `meat.setState`) — no more “invalid assignment to const” errors.  
- `use()` warnings only fire on *actual* method overwrites (no more PLUGIN_CLASH spam).  
- Restored aliases and APIs for backwards-compat:  
  - `meat.bindToGlobal()`  
  - `meat.signal()`  
  - `meat.listen()`  
  - `meat.logState()`  
  - `meat.chronicle()`


🍖 Core Features (Ribwich Edition)

- ✅ Reactive state engine with set(), get(), and setState()
- 🧠 Per-key mutation history via MeatChronicle
- ⏪ Undo / rollback / safe execution with undo(), rollbackAll(), and safe(fn)
- 🔍 Runtime introspection (dump(), find(), changedKeys(), lastModified())
- 🧪 Temporal snapshotting with historySnapshot()
- 🔗 DOM binding via linkToDOM() — usable across Alpine, Svelte, Astro
- 🧩 Plugin architecture with .use() for extensions
- 🗂️ LocalStorage support via persist() and load()
- ⚙️ Framework adapters for Vue, Laravel, React, Nuxt, and more

---

## 🍖 Features

- Reactive state via `meat.set()` / `meat.get()`
- Scoped listeners and wildcard events
- DOM syncing with `linkToDOM()`
- Zero dependencies
- Plugin architecture via `.use()`
- Vue 3 composables
- LocalStorage persistence

---

## 📦 Install

```bash
npm install @lucianofpereira/meat
# or
yarn add @lucianofpereira/meat
```

Basic usage:

```ts
import meat from 'meat';
meat.set('theme', 'dark');
```

---

## 🔌 Plugin Support

```ts
meat.use(pluginFn); // Load MEAT-enhancing logic
```

Examples:

- `logState.js` adds `meat.logState()` using `console.table()`
- `meatVuePlugin.js` enables `$meat` globally in Vue apps

Composables:

```ts
const theme = useMeat('theme'); // Vue reactive ref
```

### 🧠 Included Plugins

MEAT ships with **MeatChronicle**, a single all-in-one runtime plugin providing:

- per-key mutation logs
- `undo()` and `rollback()` capabilities
- `safe(fn)` execution guards
- temporal snapshots via `historySnapshot()`
- `logMessage()` with scoped tracing

Activate with:

```js
import { MeatChronicle } from './plugins/chronicle.js';
meat.use(MeatChronicle);
```

---

## 📚 Docs Overview

| Page | Description |
|------|-------------|
| [README](./docs/README.md) | Feature overview |
| [Getting Started](./docs/Getting-Started.md) | Setup tutorial |
| [Architecture](./docs/architecture.md) | Internal design flow |
| [Plugins](./docs/plugins.md) | Writing MEAT plugins |
| [MeatChronicle](./docs/chronicle.md) | Plugin architecture and API |


### 🔧 Framework Integrations

| Page | Framework |
|------|-----------|
| [Alpine](./docs/alpine.md) | Alpine.js |
| [Angular](./docs/angular.md) | Angular |
| [Astro](./docs/astro.md) | Astro |
| [Nuxt](./docs/nuxt.md) | Nuxt |
| [Next](./docs/next.md) | Next.js |
| [React](./docs/react.md) | React |
| [Qwik](./docs/qwik.md) | Qwik |
| [Solid](./docs/solid.md) | Solid |
| [Svelte](./docs/svelte.md) | Svelte |
| [Vue](./docs/vue.md) | Vue |
| [Laravel](./docs/laravel.md) | Blade macros, middleware, event syncing |

---

## 🐘 Laravel Integration

MEAT includes first-class support for Laravel with Blade directives, hydration macros, hashed syncing, and event-binding middleware.

```blade
@meatHydrate($state)
@meatSync('message')
@meatSyncEvent('message', \App\Events\PayloadSynced::class)
```



### 🧪 Examples & Tests

- [`examples/`](./examples/) — MEAT demos for every framework  
- [`test/`](./test/) — Unit tests for all plugin integrations

---

## 🧪 Testing

```bash
npm test
```

Covers:
- Core event bus
- Plugin usage
- Vue reactivity

---

## 🛠 Contributing

Fork → branch → build → PR.  
See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup tips and code style.

---

## 💬 Contact

**Author**: Luciano Federico Pereira  
💼 [LinkedIn](https://www.linkedin.com/in/lucianofedericopereira/)  
🐛 [GitHub Issues](https://github.com/lucianofedericopereira/meat/issues)

---

## 📜 License

Licensed under the [MIT License](./LICENSE) © 2025 Luciano Federico Pereira

---

> MEAT is hot, readable, and ready for your plate.

---

## 💛 Support MEAT

MEAT is maintained by [Luciano Federico Pereira](https://github.com/lucianofedericopereira).  
If you find it useful, consider sponsoring via:

- [Ko-fi](https://ko-fi.com/lucianofedericopereira)
- [Liberapay](https://liberapay.com/lucianofedericopereira)

Your support fuels open-source tools that are lean, clean, and reactive-driven. 🐮🔥
