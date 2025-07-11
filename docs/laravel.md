# 🐘 MEAT Laravel Integration

MEAT ships with a first-class Laravel experience via `meat-laravel`: a subproject that brings hydration macros, hashed syncing, and event-driven Blade directives into your Laravel views.

---

## Introduction

Laravel’s Blade templating is elegant for server-rendered views, but it wasn’t designed with reactive, stateful interfaces in mind. As soon as you need to hydrate data on the frontend, sync updates back to the server, or broadcast events, you end up writing repetitive boilerplate: manually passing variables into every view, instantiating scripts, and wiring up event listeners.

MEAT Laravel integration solves these pain points by providing:
- Blade macros that automatically hydrate your frontend state and inject secure, hashed sync keys.
- Middleware that shares a deterministic HMAC-based key with all views—no more undefined variables or ad hoc helpers.
- A sync endpoint and directives (`@meatSync`, `@meatSyncEvent`) that bind server-side events to your JavaScript bridge in a single line.

With this subproject, you keep your Blade templates focused on markup, eliminate boilerplate, and gain a seamless reactive workflow that feels native to Laravel.  



## 🚀 Setup

Clone MEAT and make sure the subfolder `meat-laravel/` is present.

```
composer install
```

If using Laravel 12+:

### Register Global Middleware

In `bootstrap/app.php`:

```
->withMiddleware(function (Middleware $middleware): void {
    $middleware->append(\App\Http\Middleware\InjectMeatKey::class);
})
```

This middleware auto-generates a hashed sync key and injects `$key` into all views.

### Define Secret

Add to your `.env`:

```
MEAT_SECRET=your-meat-secret
```

Used by `MeatHasher` to produce deterministic HMAC-SHA256 hashes.

---

## 🔧 Blade Macros

`meat-laravel` adds several macros to streamline syncing state in Blade:

### `@meatHydrate`

Hydrates frontend state:

```
@meatHydrate($state)
```

### `@meatSync`

Binds a backend key to MEAT:

```
@meatSync('message')
```

### `@meatSyncEvent`

Syncs and binds an event to MEAT:

```
@meatSyncEvent('message', \App\Events\PayloadSynced::class)
```

Registers `message` as the syncing payload and the event class to dispatch when updated.

### `@meatScripts`

Inject MEAT bridge scripts:

```
@meatScripts
```

This loads `meat-laravel-bridge.js` from the `public/vendor/meat/js/` folder.

---

## 🧱 Middleware: `InjectMeatKey`

```
public function handle(Request $request, Closure $next)
{
    $payload = ['field' => 'message'];
    $key = MeatHasher::hash($payload);
    view()->share('key', $key);
    return $next($request);
}
```

---

## ⚡ Hashed Sync Keys

The `MeatHasher` utility generates sync-safe keys:

```
$key = MeatHasher::hash(['field' => 'message']);
```

Used by Blade macros and injected via middleware.

---

## 📬 Sync Endpoint

`meat-laravel` provides a POST route to accept sync updates:

```
Route::middleware(['web', VerifyMeatTransaction::class])
    ->post('/meat-sync', MeatSyncController::class)
    ->name('meat.sync');
```

- Validates payload and hash
- Dispatches event if needed

---

## 🧰 Publishing Assets

```
php artisan vendor:publish --tag=meat-assets
```

This adds `meat.js` to `public/vendor/meat/js/meat.js`.

---

## 📦 Structure

Laravel integration lives in:

```
meat-laravel/
├── src/
│   ├── Blade/
│   ├── Helpers/
│   ├── Http/
│   └── Middleware/
├── resources/views/macros/
├── public/vendor/meat/js/
├── MeatServiceProvider.php
```

---

## 🛠 Authoring Tips

- Use `view()->share()` to pass data globally
- Directives parse arguments like `@meatSyncEvent('key', Class::class)`
- Middleware is preferred for injecting sync keys automatically
- Event classes should be serializable and broadcast-safe

---

## 📘 Examples

```
@meatSyncEvent('user.status', \App\Events\UserStatusUpdated::class)
```

```
event(new UserStatusUpdated($user));
```

The frontend sync bridge will hydrate state and dispatch listeners based on the event.

---

Want to contribute improvements or new macros?  
See [`CONTRIBUTING.md`](../CONTRIBUTING.md) and join the gravy flow.
