# MeatChronicle Plugin

Extend MEAT with timeline, undo/rollback, safe execution, and introspection APIs.

---

## Overview

MeatChronicle is a unified plugin for MEAT that tracks every mutation, timestamps changes, tags sources, and exposes undo/rollback and snapshot capabilities without monkey‐patching core methods. All history lives in memory and is keyed by state property.

---

## Installation

Place `chronicle.js` in your plugins folder or import from the package:

```js
import { MeatChronicle } from './plugins/chronicle.js'
// or from npm:
// import { MeatChronicle } from '@lucianofpereira/meat/plugins/chronicle'
```

---

## Activation

Register the plugin before any mutations:

```js
meat.use(MeatChronicle, { limit: 100 })
```

- `limit` (number): maximum history entries per key (default 50).

---

## API Reference

### Undo / Rollback

- `meat.undo(key)`  
  Revert the last mutation for `key`. No effect if fewer than two entries.
- `meat.rollback(key)`  
  Alias for `undo(key)`.
- `meat.rollbackAll()`  
  Undo the most recent change for every tracked key.

### Safe Execution

- `meat.safe(fn)`  
  Execute `fn()`. If it throws, automatically invoke `rollbackAll()` and log the error.

### History Inspection

- `meat.getHistory(key)` → `Array<{ value, timestamp, source }>`  
  Returns the recorded entries for `key`.
- `meat.clearHistory(key?)`  
  If `key` provided, remove its history; otherwise clear all logs.
- `meat.logHistory(key)`  
  Console.table the history of `key`.
- `meat.changedKeys()` → `string[]`  
  List all keys with recorded history.
- `meat.historySnapshot()` → `Record<string, Array<{ value, timestamp, source }>>`  
  Deep copy of the entire history log map.

### Logging

- `meat.logMessage(message, context)`  
  Unified console logger. Prefixes with `[MEAT:context]` and ISO timestamp.

---

## Example Usage

```js
import meat from 'meat'
import { MeatChronicle } from './plugins/chronicle.js'

meat.use(MeatChronicle, { limit: 20 })

meat.set('count', 1)
meat.set('count', 2)
meat.undo('count')
// count is now 1

meat.safe(() => {
  meat.set('config', null)
  throw new Error('Oops')
})
// config rolled back to previous and error logged

console.table(meat.getHistory('count'))
// view all count mutations

console.log(meat.changedKeys())
// e.g. ['count', 'config']

const snapshot = meat.historySnapshot()
// full history dump
```

---

## Best Practices

- Register MeatChronicle before any `.set()` calls to capture full history.
- Use `meat.safe()` around critical operations (network calls, user actions).
- Limit history size via the `limit` option to control memory use.
- Combine with `meat.logMessage()` and `meat.logHistory()` in development.

---

## Cleanup

No special cleanup needed. History is retained for the lifetime of the MEAT instance. Use `meat.clearHistory()` to reset logs.

---

## Version & Compatibility

- Introduced in **Ribwich Edition** (version 1.0.0-ribwich).
- Compatible with all MEAT framework adapters and plugins.
