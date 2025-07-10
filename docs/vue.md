# Vue Integration Guide

MEAT integrates seamlessly with Vue 3 via a global plugin and a reactive composable.

---

## 1. Global Injection

Use `meatVuePlugin.js` to add `$meat` to the Vue app:

```js
import { meatVuePlugin } from '../src/plugins/meatVuePlugin.js';
app.use(meatVuePlugin); // Adds $meat to all components
```

Access inside components:

```js
this.$meat.set('user', { name: 'Luciano' });
```

---

## 2. Composable: `useMeat`

Import `useMeat` to bind MEAT keys to reactive `ref`s:

```js
import { useMeat } from '../src/plugins/vue/useMeat.js';
const count = useMeat('count');
```

Use in templates:

```vue
<p>{{ count }}</p>
```

---

## Notes

- Reactivity is one-way: MEAT updates Vue via internal `watch`
- Listeners are automatically cleaned up on `onUnmounted`
- Useful for centralizing state across large applications

---

## Advanced Integration

- Sync with Vuex or Pinia if needed via plugin bridges
- Use `watchEffect` or `computed` on `useMeat()` refs
- Combine with MEAT plugins for global UI state control
