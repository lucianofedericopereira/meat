import meat from '../src/meat.ts';

meat.set('count', 7);
console.assert(meat.get('count') === 7, 'Qwik plugin should sync state');
console.log('✅ Qwik integration test passed.');
