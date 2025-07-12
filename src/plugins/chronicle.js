function MeatChronicle(meat, options = {}) {
  const log = new Map();
  const maxEntries = options.limit ?? 50;

  meat.logMessage = (msg, ctx = "chronicle") => {
    const stamp = new Date().toISOString();
    console.log(`[MEAT:${ctx}] ${msg} @ ${stamp}`);
  };

  const push = (key, value, source = "mutation") => {
    const history = log.get(key) ?? [];
    history.push({ value, timestamp: Date.now(), source });
    if (history.length > maxEntries) history.shift();
    log.set(key, history);
  };

  meat.subscribe(snapshot => {
    Object.entries(snapshot).forEach(([key, value]) => {
      push(key, value, "setState"); // default tagging
    });
  });

  meat.undo = key => {
    const history = log.get(key);
    if (!history || history.length < 2) return;
    const previous = history[history.length - 2].value;
    meat.set(key, previous);
    push(key, previous, "undo");
    meat.logMessage(`Undo for '${key}'`, "undo");
  };

  meat.rollback = key => meat.undo(key);

  meat.rollbackAll = () => {
    for (const key of log.keys()) {
      meat.undo(key);
    }
    meat.logMessage("Rolled back all keys", "rollbackAll");
  };

  meat.safe = fn => {
    try { fn(); }
    catch (err) {
      meat.rollbackAll();
      meat.logMessage(`Rollback on error: ${err}`, "safe");
    }
  };

  meat.getHistory = key => log.has(key) ? [...log.get(key)] : [];
  meat.clearHistory = key => key ? log.delete(key) : log.clear();
  meat.logHistory = key => console.table(meat.getHistory(key));
  meat.changedKeys = () => [...log.keys()];
  meat.historySnapshot = () =>
    Object.fromEntries([...log.entries()].map(([k, entries]) => [k, [...entries]]));

  meat.logMessage("MeatChronicle loaded securely");
}
