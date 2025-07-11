import meat from '../../src/meat.ts';

meat.set('theme', 'dark');
console.assert(meat.get('theme') === 'dark', 'Nuxt plugin should sync MEAT state');
console.log('✅ Nuxt integration test passed.');
