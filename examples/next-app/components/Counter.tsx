import { useMeat } from '../../../src/plugins/next/useMeat';
import meat from '../../../src/meat.ts';

export default function Counter() {
  const count = useMeat('count');

  function increment() {
    meat.set('count', count + 1);
  }

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <p>MEAT count: {count}</p>
    </div>
  );
}
