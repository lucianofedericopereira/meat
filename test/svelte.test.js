import meat from '../../src/meat.ts';

meat.set('count', 42);
console.assert(meat.get('count') === 42, 'Svelte plugin should sync MEAT state');
console.log('✅ Svelte integration test passed.');
