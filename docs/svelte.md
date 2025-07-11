# 🧈 Svelte Plugin for MEAT

Svelte is a compiler-first UI framework that surgically updates the DOM without a virtual DOM. It pairs beautifully with MEAT’s reactive state model, allowing you to bind MEAT state directly to Svelte stores.

---

## 🧩 Plugin Setup

Use MEAT inside Svelte components via the `useMeat()` helper:

```js
import { useMeat } from '../../src/plugins/svelte/useMeat.js';
```

This returns a Svelte-readable store that stays in sync with MEAT’s internal state.

---

## 🚀 Example Component

```svelte
<script>
  import { useMeat } from '../../src/plugins/svelte/useMeat.js';
  import meat from '../../../src/meat.ts';

  const count = useMeat('count');

  function increment() {
    meat.set('count', $count + 1);
  }
</script>

<button on:click={increment}>Increment</button>
<p>MEAT count: {$count}</p>
```

---

## 📂 Demo

Explore [`examples/svelte-ui/`](../../examples/svelte-ui/) to see:
- MEAT-powered counter with reactive UI
- Store-based updates using Svelte primitives
- Vite-powered setup with TypeScript support

---

## 🧪 Testing

See [`test/svelte.test.js`](../../test/svelte.test.js) for basic validation:

```js
meat.set('count', 42);
console.assert(meat.get('count') === 42);
```

This confirms MEAT state syncs correctly with Svelte’s store system.

---

## 📚 Notes

- `useMeat()` wraps MEAT state in a Svelte-readable store
- Updates propagate automatically via MEAT’s event bus
- You can use MEAT alongside Svelte’s `writable`, `derived`, or `get` if needed

---

## ✅ Summary

✅ Reactive updates via Svelte stores  
✅ Zero-config MEAT integration  
✅ SSR-safe and Vite-ready  
✅ Ideal for fast, compiled UIs
