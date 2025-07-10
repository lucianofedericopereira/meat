# 🥩 MEAT

**Mitt Enhanced Application Toolkit**  
Minimal reactivity system with plugin support, Vue composables, and zero dependencies.

![Version](https://img.shields.io/badge/version-1.A1-saucy)
![License](https://img.shields.io/github/license/lucianofedericopereira/meat)
![Code Size](https://img.shields.io/github/languages/code-size/lucianofedericopereira/meat)
![Contributions](https://img.shields.io/badge/contributions-open-brightgreen)
![Author](https://img.shields.io/badge/made%20by-Luciano%20Federico%20Pereira-blue)

---

## 🍖 Features

- Reactive state via set() / get()
- Scoped listeners and wildcards
- DOM syncing with linkToDOM()
- Built-in plugin support
- Optional Vue 3 composables
- LocalStorage persistence

---

## 📦 Install

npm install meat  
# or  
yarn add meat

Import and use:

import meat from 'meat';  
meat.set('theme', 'dark');

---

## 🔌 Plugins

meat.use(pluginFn); // Load external logic

Example:  
logState.js adds meat.logState() using console.table()

Vue example:  
app.use(meatVuePlugin); // adds $meat globally  
const theme = useMeat('theme'); // reactive ref

---

## 📚 Documentation

- docs/index.md — Docs homepage  
- docs/architecture.md — Internal design  
- docs/plugins.md — Plugin API  
- docs/vue.md — Vue 3 integration  
- example/ — Usage demos in Vue and HTML

---

## 🧪 Testing

Run test suite:

npm test

Includes:  
- Core logic  
- Plugin behavior  
- Vue integration

---

## 🛠 Contributing

Fork, branch, build, PR.  
See docs/contributing.md for community tips and code style.

---

## 💬 Contact

Author: Luciano Federico Pereira  
LinkedIn: https://www.linkedin.com/in/lucianofedericopereira/  
Issues: https://github.com/lucianofedericopereira/meat/issues

---

## 📜 License

MIT © Luciano Federico Pereira

---

MEAT is hot, readable, and ready for your plate.
