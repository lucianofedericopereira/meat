// test/meat.test.js

import meat from '../src/meat.js';

console.log('🔥 Testing MEAT core functionality...');

meat.set('greeting', 'hello');
console.assert(meat.get('greeting') === 'hello', 'Should retrieve set value');

meat.watch('greeting', val => {
  console.log('Watcher triggered:', val);
});

meat.set('greeting', 'hola'); // Triggers watcher

meat.setState({ count: 1, theme: 'dark' });
console.assert(meat.get('count') === 1, 'Should set count');
console.assert(meat.has('theme'), 'Theme key should exist');

console.log('✅ Basic MEAT tests complete.');
