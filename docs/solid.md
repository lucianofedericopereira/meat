# 🧱 SolidJS Plugin for MEAT

SolidJS is a fine-grained reactive UI framework that pairs beautifully with MEAT’s lightweight state model. With zero virtual DOM and blazing performance, Solid lets MEAT plug directly into its signal system for seamless reactivity.

---

## 🧩 Plugin Setup

Use MEAT inside Solid components via the `useMeat()` composable:

```ts
import { useMeat } from '../../../src/plugins/solid/useMeat.ts';
```

This returns a Solid signal that stays in sync with MEAT’s internal store.

---

## 🚀 Example Component

```tsx
import { Component } from 'solid-js';
import { useMeat } from '../../../src/plugins/solid/useMeat.ts';
import meat from '../../../src/meat.ts';

const Counter: Component = () => {
  const count = useMeat('count');

  return (
    <div>
      <button onClick={() => meat.set('count', count() + 1)}>Increment</button>
      <p>MEAT count: {count()}</p>
    </div>
  );
};

export default Counter;
```

---

## 📂 Demo

Explore [`examples/solid-demo/`](../../examples/solid-demo/) to see:
- MEAT-powered counter with reactive UI
- Signal-based updates using Solid primitives
- SSR-ready setup with Vite and TypeScript

---

## 🧪 Testing

See [`test/solid.test.ts`](../../test/solid.test.ts) for basic validation:

```ts
meat.set('count', 99);
const count = useMeat('count');
console.assert(count() === 99);
```

This confirms MEAT state syncs correctly with Solid signals.

---

## 📚 Notes

- MEAT state updates trigger Solid signals automatically
- `useMeat()` handles subscription and cleanup internally
- You can use MEAT alongside Solid’s `createEffect`, `createMemo`, or `createStore` if needed

---

## ✅ Summary

✅ Fine-grained reactivity via signals  
✅ Zero-config MEAT integration  
✅ SSR-safe and Vite-ready  
✅ Ideal for fast, reactive UIs
