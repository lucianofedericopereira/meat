# 🌌 Astro Plugin for MEAT

Astro is a static site builder that supports islands architecture and ships zero JS by default. It's framework-agnostic, fast, and perfect for SSR-first reactivity. MEAT can be integrated to hydrate state across both server and client.

---

## 🧩 Plugin Setup

Install the plugin via Astro config:

```ts
// astro.config.mjs
import meatAstroPlugin from '../src/plugins/astro/meatAstroPlugin.ts';

export default {
  integrations: [meatAstroPlugin()]
};
```

This injects MEAT state into every page during build via `window.meat`.

---

## 🚀 Example Usage

```astro
---
import Counter from '../components/Counter.astro';
import meat from '../../../src/meat.ts';

meat.set('count', 0); // Static initialization
---

<html lang="en">
  <head>
    <title>MEAT + Astro Demo</title>
  </head>
  <body>
    <h1>Welcome to MEAT + Astro</h1>
    <Counter />
    <p>MEAT snapshot: {JSON.stringify(meat.getState())}</p>
  </body>
</html>
```

---

## 🧮 Counter Component

```astro
---
import { useMeat } from '../../src/plugins/astro/useMeat.ts';
const count = useMeat('count');
---

<button on:click={() => count.set(count.get() + 1)}>Increment</button>
<p>Count: {count.get()}</p>
```

Astro supports hydration directives like `client:load`, `client:visible`, and `client:idle` for interactivity.

---

## 📂 Demo

See [`examples/astro-site/`](../../examples/astro-site/) for a working Astro integration showcasing MEAT’s state updates and SSR rendering.

---

## 🧪 Testing

See [`test/astro.test.ts`](../../test/astro.test.ts) for a basic SSR validation of MEAT state:

```ts
meat.clear();
meat.setState({ siteTitle: 'MEAT + Astro' });
console.assert(meat.getState().siteTitle === 'MEAT + Astro');
```

This test doesn't rely on browser globals and simulates build-time state setup.

---

## 📚 Notes

- MEAT is injected at build time — use `meat.ts` for shared SSR-safe logic
- For client-side hydration, combine MEAT with Astro’s island components
- The plugin doesn’t hydrate automatically — use Astro directives as needed

---

## ✅ Summary

✅ SSR-safe store injection  
✅ Lightweight, zero-JS default  
✅ Compatible with Astro islands  
✅ Perfect for hybrid MEAT/HTML setups
