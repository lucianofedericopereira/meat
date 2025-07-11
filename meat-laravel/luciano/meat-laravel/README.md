# meat-laravel

**Blade-first reactive toolkit for Laravel—powered by MEAT**

MEAT lets you build reactive Blade components with zero JavaScript, controllers, or route definitions. This package drops into Laravel and gives you native Blade directives that sync frontend state directly to backend events.

---

## 🚀 Features

- `@meatHydrate()` — Injects MEAT state from PHP into Blade  
- `@meatSync()` — Binds state to DOM inputs for reactive syncing  
- `@meatSyncEvent()` — Sends frontend changes to Laravel events  
- `@meatScripts` — Injects MEAT’s JS bridge for Laravel integration  
- Secure HMAC hash validation via middleware  
- Auto-registered `/meat-sync` route  

---

## 🔧 Installation

```bash
composer require luciano/meat-laravel
```

Laravel will auto-discover the service provider.

---

## 🧪 Usage Example

In a Blade view:

```blade
@meatHydrate(['theme' => 'dark', 'username' => $user->name])
@meatSync('theme')
@meatSyncEvent('theme', \App\Events\ThemeChanged::class)
@meatScripts
```

In JS (auto-loaded):

```js
meat.watchAll?.((key, value) => {
  // Payload sent to Laravel with tx_id, hash, and event header
});
```

---

## 🛡️ Payload Security

All payloads are hashed with HMAC SHA-256 before syncing. Laravel verifies integrity using `MEAT_SECRET` from `.env`.

---

## 📂 File Structure Overview

```
src/
├── MeatServiceProvider.php
├── Blade/MeatDirectives.php
├── Http/Controllers/MeatSyncController.php
├── Middleware/VerifyMeatTransaction.php
├── Events/MeatPayloadSynced.php
├── Helpers/MeatHasher.php
resources/views/macros/
├── hydrate.blade.php
├── sync.blade.php
├── syncEvent.blade.php
```

---

## 🧠 Philosophy

This package is designed for **Blade-first developers** who want:

- Reactive interfaces without Alpine or Livewire  
- Secure backend sync with zero controller bloat  
- Laravel-native syntax and simplicity  

---

Ready to ship MEAT-native Laravel apps with no fuss and all flavor.
