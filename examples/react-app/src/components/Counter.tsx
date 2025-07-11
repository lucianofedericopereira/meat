import { useMeat } from '@meat/plugins/react/useMeat';
import meat from '@meat';

export default function Counter() {
  const count = useMeat<number>('count');

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
