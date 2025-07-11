# 🧭 Nuxt Plugin for MEAT

Nuxt is a powerful Vue-based framework for building SSR, static, and hybrid apps. MEAT integrates seamlessly via Nuxt plugins and Vue composables, enabling reactive state across server and client.

---

## 🧩 Plugin Setup

Create a Nuxt plugin to inject MEAT into the app context:

```ts
// plugins/meat.client.ts
import meat from '../../../../src/meat.ts';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('meat', meat);
});
```

Then register it in your config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  plugins: ['~/plugins/meat.client.ts']
});
```

---

## 🚀 Example Component

```vue
<script setup lang="ts">
import { useMeat } from '../../src/plugins/nuxt/useMeat.ts';
import meat from '@meat';

const count = useMeat('count');

function increment() {
  meat.set('count', count.value + 1);
}
</script>

<template>
  <main>
    <h1>MEAT + Nuxt Demo</h1>
    <button @click="increment">Increment</button>
    <p>MEAT count: {{ count }}</p>
  </main>
</template>
```

---

## 📂 Demo

Explore [`examples/nuxt-app/`](../../examples/nuxt-app/) to see:
- MEAT-powered counter with reactive UI
- Plugin-based injection and composables
- SSR-ready setup with Nuxt 3 and TypeScript

---

## 🧪 Testing

See [`test/nuxt.test.js`](../../test/nuxt.test.js) for basic validation:

```js
meat.set('theme', 'dark');
console.assert(meat.get('theme') === 'dark');
```

This confirms MEAT state syncs correctly inside Nuxt.

---

## 📚 Notes

- Use `.client.ts` suffix to limit plugin to browser context
- `useMeat()` wraps MEAT state in a Vue `ref` and subscribes on mount
- You can access MEAT globally via `useNuxtApp().$meat` if needed

---

## ✅ Summary

✅ Reactive updates via Vue refs  
✅ Plugin-based MEAT injection  
✅ SSR-safe and Nuxt-native  
✅ Ideal for hybrid Vue apps
