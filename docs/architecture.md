# MEAT Architecture Overview

This document outlines how MEAT is structured internally — focusing on data flow, event handling, and plugin extensibility.

---

## Overview

MEAT wraps reactive state logic using:

- A central state object
- A scoped event bus (`eventBus`)
- Plugin injection points
- Optional DOM or Vue bindings

---

## State Flow

- `state`: private object storing key-value pairs
- `set(key, val)`: updates a key (immutable by default)
- `setState(obj)`: merges multiple values
- `get(key)`, `has(key)`, `serialize()`: accessors

---

## Event System

Built around a `Map` of listeners keyed by event type.

- Scoped events: `meat:update:<key>`
- Global events: `meat:update`
- Wildcard: `*` catches all events

Each key uses:

```js
eventBus.on("meat:update:theme", cb);
eventBus.emit("meat:update:theme", newVal);
```

---

## Reactivity Strategy

MEAT avoids proxies/reactive wrappers. Instead:

- Emits updates manually
- Uses `watch()` and `subscribe()` to respond
- Vue integration uses `ref()` + lifecycle cleanup

---

## Plugins

Plugins extend MEAT by attaching methods or listeners.

Each receives:

```js
plugin(meat, options);
```

---

## DOM Integration

`linkToDOM()` syncs MEAT state to a DOM element via attribute, e.g.:

```html
<div id="app" data-meat='{"count":1}'></div>
```

---

## Summary

MEAT is lightweight, explicit, and highly extensible — designed for clarity, control, and adaptability in both vanilla and Vue environments.
