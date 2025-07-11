import { component$ } from '@builder.io/qwik';
import { useMeat } from '../../src/plugins/qwik/useMeat';

export const Counter = component$(() => {
  const count = useMeat('count');

  return (
    <>
      <button onClick$={() => count.value++}>Increment</button>
      <p>MEAT count: {count.value}</p>
    </>
  );
});
