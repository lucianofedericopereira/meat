// test/plugins.test.js

import meat from '../src/meat.js';

console.log('🔌 Testing plugin injection...');

function testPlugin(meat) {
  meat.sayHi = () => 'Hi from plugin!';
}

meat.use(testPlugin);
console.assert(meat.sayHi() === 'Hi from plugin!', 'Plugin method should work');

console.log('✅ Plugin system is cookin.');
