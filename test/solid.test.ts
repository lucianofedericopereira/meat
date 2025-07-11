import { useMeat } from '../src/plugins/solid/useMeat.ts';
import meat from '../src/meat.ts';

meat.set('count', 99);
const count = useMeat('count');

console.assert(count() === 99, 'Solid useMeat should return synced signal');
console.log('✅ Solid integration test passed.');
