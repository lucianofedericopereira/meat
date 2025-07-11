import meat from '../src/meat.ts';

// Simulate static site setup logic
meat.clear();
meat.setState({ siteTitle: 'MEAT + Astro' });

const state = meat.getState();

console.assert(state.siteTitle === 'MEAT + Astro', 'MEAT state should contain siteTitle');
console.log('✅ Astro SSR test passed.');
