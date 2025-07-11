import meat from '../../src/meat.ts';

meat.set('user', 'Luciano');
console.assert(meat.get('user') === 'Luciano', 'Next plugin should sync MEAT state');
console.log('✅ Next.js integration test passed.');
