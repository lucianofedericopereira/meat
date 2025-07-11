# Getting Started with MEAT

MEAT is a lightweight JavaScript toolkit for reactive state — zero dependencies, infinite clarity. This guide walks through setting up MEAT in vanilla JS or Vue 3.

---

## Installation

Via npm:

```bash
npm install @lucianofpereira/meat
```

Or via CDN:

```html
<script src="https://unpkg.com/meat/src/meat.js"></script>
```

---

## Basic Usage

```js
import meat from 'meat';

meat.set('count', 1);
console.log(meat.get('count')); // → 1

meat.watch('count', val => {
  console.log("Count changed:", val);
});

meat.set('count', 2); // triggers watcher
```

---

## Vue 3 Integration

```js
import { meatVuePlugin } from './src/plugins/meatVuePlugin.js';
app.use(meatVuePlugin);

import { useMeat } from './src/plugins/vue/useMeat.js';
const theme = useMeat('theme');
```

Use inside templates:

```vue
<p>Theme: {{ theme }}</p>
```

---

## State Persistence

```js
meat.persist();       // Save state to localStorage
meat.load();          // Restore saved state
```

---

## Plugin Example

```js
import { logStatePlugin } from './src/plugins/logState.js';
meat.use(logStatePlugin);
meat.logState(); // outputs current state as a table
```

For more guides, see `/docs`.
