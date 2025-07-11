# 🏔️ Alpine.js Plugin for MEAT

Alpine.js is a lightweight, declarative JavaScript framework designed for interactivity in HTML—especially popular within Laravel and Tailwind CSS projects. While it doesn't support hooks or component stores like React or Vue, its magic methods and DOM-centric approach work beautifully for MEAT's reactive state model.

---

## 🔌 Installation & Setup

First, register the MEAT plugin with Alpine:

```js
import Alpine from 'alpinejs';
import { meatAlpinePlugin } from '../../src/plugins/alpine/meatAlpinePlugin.js';

Alpine.plugin(meatAlpinePlugin);
Alpine.start();
```

This exposes MEAT as a magic `$meat` object inside Alpine components.

---

## 🚀 Example Usage

```html
<div x-data="{ count: 0 }" x-init="$watch('count', val => $meat.set('count', val))">
  <button @click="count++">Increment</button>
  <p x-text="count"></p>
  <p>MEAT value: <span id="meat-count"></span></p>
</div>

<script>
  meat.subscribe('count', val => {
    document.getElementById('meat-count').textContent = val;
  });
</script>
```

This example:
- Updates MEAT state whenever Alpine's `count` changes
- Displays MEAT value independently via DOM subscription

---

## 🧭 Design Considerations

Alpine.js doesn't provide centralized reactive stores or lifecycle hooks like `onMount` or `watchEffect`. Instead, you can:
- Use `$watch` to listen for changes and sync with MEAT
- Access MEAT anywhere in `x-data`, `x-init`, or via magic methods like `$meat`

If you need more abstraction, you can use the optional helper:

```js
import { useMeat } from './useMeat.js';

const count = useMeat('count');
count.set(5);
```

---

## 🧪 Testing

See [`test/alpine.test.js`](../../test/alpine.test.js) for basic plugin validation:
- Verifies `$meat` is available within Alpine
- Confirms MEAT state updates reflect UI changes

---

## 📂 Demo

Check out [`examples/alpine-demo/index.html`](../../examples/alpine-demo/index.html) for a working Alpine setup with MEAT reactivity.

---

## ✅ Summary

✅ Lightweight integration  
✅ Reactive sync via `$watch` and subscriptions  
✅ Ideal for Laravel, Blade, and Tailwind environments  
✅ Works with MEAT’s state and API out of the box
