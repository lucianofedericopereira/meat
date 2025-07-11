# ⚛️ React Plugin for MEAT

React is a component-based UI library that pairs beautifully with MEAT’s reactive state model. With hooks and functional components, MEAT plugs directly into React’s lifecycle for seamless updates.

---

## 🧩 Plugin Setup

Use MEAT inside React components via the `useMeat()` hook:

```ts
import { useMeat } from '@meat/plugins/react/useMeat';
```

This hook returns a reactive value that stays in sync with MEAT’s internal store.

---

## 🚀 Example Component

```tsx
import { useMeat } from '@meat/plugins/react/useMeat';
import meat from '@meat';

export default function Counter() {
  const count = useMeat<number>('count');

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

Explore [`examples/react-app/`](../../examples/react-app/) to see:
- MEAT-powered counter with React hooks
- Vite-powered setup with TypeScript
- Path alias support for clean imports

---

## 🧪 Testing

See [`test/react.test.js`](../../test/react.test.js) for basic validation:

```js
meat.set('theme', 'dark');
console.assert(meat.get('theme') === 'dark');
```

This confirms MEAT state syncs correctly inside React components.

---

## 🧠 TypeScript Setup

To support `.ts` imports and aliases, ensure your root `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@meat": ["src/meat.ts"],
      "@meat/*": ["src/*"]
    }
  }
}
```

And in `examples/react-app/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "allowImportingTsExtensions": true
  },
  "include": ["src"]
}
```

---

## 📚 Notes

- `useMeat()` subscribes to MEAT state and updates via React’s `useState` and `useEffect`
- You can use MEAT inside client components, server components, or context providers
- Path aliases (`@meat`) simplify imports across all demos
- Declaration files (`useMeat.d.ts`, `meat.d.ts`) ensure full type safety

---

## ✅ Summary

✅ Reactive updates via React hooks  
✅ SSR-safe and React-native  
✅ Plugin-ready for global MEAT access  
✅ Fully typed with path alias support
