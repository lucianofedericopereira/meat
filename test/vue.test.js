// test/vue.test.js

import { useMeat } from '../src/plugins/vue/useMeat.js';
import { effect } from '@vue/reactivity';

const count = useMeat('count');
meat.set('count', 42);

effect(() => {
  console.log('Vue reactive ref value:', count.value);
});

console.assert(count.value === 42, 'useMeat should return synced Vue ref');
console.log('✅ Vue integration test passed.');
