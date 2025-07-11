import meat from '../../src/meat.ts';

meat.set('theme', 'dark');
console.assert(meat.get('theme') === 'dark', 'React plugin should sync MEAT state');
console.log('✅ React integration test passed.');
