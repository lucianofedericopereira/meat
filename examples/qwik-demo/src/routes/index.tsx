import { component$ } from '@builder.io/qwik';
import Counter from '../components/Counter';

export default component$(() => {
  return (
    <section>
      <h1>MEAT + Qwik Demo</h1>
      <Counter />
    </section>
  );
});
