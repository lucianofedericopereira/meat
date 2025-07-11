<script>
  import { useMeat } from '../../src/plugins/svelte/useMeat.js';
  import meat from '../../meat.ts';

  const count = useMeat('count');

  function increment() {
    meat.set('count', $count + 1);
  }
</script>

<button on:click={increment}>Increment</button>
<p>MEAT count: {$count}</p>
