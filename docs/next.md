# ⚛️ Next.js Plugin for MEAT

Next.js is a full-stack React framework that supports SSR, static generation, and hybrid rendering. MEAT integrates seamlessly via React hooks and optional plugin injection, enabling reactive state across pages and components.

---

## 🧩 Plugin Setup

Use MEAT inside React components via the `useMeat()` hook:

```ts
import { useMeat } from '../../../../src/plugins/next/useMeat';
```

This hook returns a reactive value that stays in sync with MEAT’s internal store.

---

## 🚀 Example Component

```tsx
import { useMeat } from '../../../../src/plugins/next/useMeat';
import meat from '../../../../src/meat.ts';

export default function Counter() {
  const count = useMeat('count');

  function increment() {
    meat.set('count', count + 1);
  }

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <p>MEAT count: {count}</p>
    </div>
  );
}
```

---

## 📂 Demo

Explore [`examples/next-app/`](../../examples/next-app/) to see:
- MEAT-powered counter with React hooks
- SSR-safe setup with Next.js 14
- TypeScript support and path aliasing

---

## 🧪 Testing

See [`test/next.test.js`](../../test/next.test.js) for basic validation:

```js
meat.set('user', 'Luciano');
console.assert(meat.get('user') === 'Luciano');
```

This confirms MEAT state syncs correctly inside Next.js components.

---

## 📚 Notes

- `useMeat()` subscribes to MEAT state and updates via React’s `useState` and `useEffect`
- You can use MEAT inside API routes, middleware, or server components
- Enable `allowImportingTsExtensions` in `tsconfig.json` to support `.ts` imports
- Use path aliases (`@meat`) for cleaner imports across examples

---

## ✅ Summary

✅ Reactive updates via React hooks  
✅ SSR-safe and Next-native  
✅ Plugin-ready for global MEAT access  
✅ Ideal for full-stack React apps
