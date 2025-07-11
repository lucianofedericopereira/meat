# ⚡ Qwik Plugin for MEAT

Qwik is a fine-grained, SSR-first framework built for instant loading and resumability. It’s perfect for MEAT’s state model because it treats reactivity as modular signals and hydrates only when needed.

---

## 🧩 Plugin Setup

Install and use MEAT with Qwik components:

```tsx
import { useMeat } from '../../src/plugins/qwik/useMeat.ts';

export default component$(() => {
  const theme = useMeat('theme');
  return <p>Current theme: {theme.value}</p>;
});
```

There’s no global registration needed—MEAT can be used directly in Qwik logic via signals and tasks.

---

## 🧮 Composable API

```ts
import { useMeat } from './useMeat.ts';

const counter = useMeat('count');
counter.value++; // Reactive MEAT update
```

Signals will sync MEAT state and reflect changes across hydrated components.

---

## 📂 Demo

Check out [`examples/qwik-demo/`](../../examples/qwik-demo/) to see:
- MEAT-powered counter with reactive UI
- SSR-first rendering with instant interactivity
- Component-based MEAT bindings

---

## 🧪 Testing

See [`test/qwik.test.ts`](../../test/qwik.test.ts) for basic validation:
- Ensures MEAT is accessible and reactive
- Confirms state updates trigger correct values

```ts
meat.set('count', 7);
console.assert(meat.get('count') === 7);
```

---

## 📚 Notes

- Qwik hydration is resumable: signals reconnect after idle or lazy load
- You can pair MEAT with `useStore` or QwikCity layouts if needed
- For larger apps, consider exposing `meat.ts` via middleware or app context

---

## ✅ Summary

✅ Reactive updates via signals  
✅ SSR-safe with resumable hydration  
✅ Zero-config usage via `useMeat()`  
✅ Lightning-fast MEAT state access
