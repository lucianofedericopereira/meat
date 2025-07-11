(() => {
  const meat = window.meat || {};
  const hydrationElement = document.getElementById('meat-hydration');
  const endpoint = '/meat-sync';
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content;

  // 🚿 Hydrate MEAT state from Blade
  if (hydrationElement) {
    try {
      const initial = JSON.parse(hydrationElement.textContent);
      for (const [key, value] of Object.entries(initial)) {
        meat.set?.(key, value);
      }
    } catch (e) {
      console.warn('MEAT hydration failed', e);
    }
  }

  // 🔁 Watch bound keys and send updates to Laravel
  meat.watchAll?.((key, value) => {
    const tx = {
      tx_id: `meat_${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: { [key]: value }
    };

    tx.hash = meat.hashPayload?.(tx.data); // If hashPayload() is defined

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf,
        'X-Meat-Event': key, // optional custom header
        'X-Meat-Hash': tx.hash || ''
      },
      body: JSON.stringify(tx)
    }).catch(err => console.error('MEAT sync failed', err));
  });
})();
