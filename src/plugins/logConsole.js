// Plugin: logConsole.js
// Logs every state mutation to console + Go CLI via /__log

export function logConsolePlugin(meat) {
  // Push to Go CLI via fetch
  const pushLog = msg => {
    fetch("/__log", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: `[MEAT] ${msg}`
    });
  };

  // Log all state changes
  meat.subscribe(state => {
    const snapshot = meat.getState();
    const keys = Object.keys(snapshot);
    keys.forEach(key => {
      const value = snapshot[key];
      console.log(`[MEAT] ${key}:`, value);
      pushLog(`${key}: ${value}`);
    });
  });

  // Optional: expose a manual trigger
  meat.logConsole = () => {
    const snapshot = meat.getState();
    Object.entries(snapshot).forEach(([key, value]) => {
      console.log(`[MEAT] ${key}:`, value);
      pushLog(`${key}: ${value}`);
    });
  };
}
