<script setup lang="ts">
import { useMeat } from '../src/plugins/nuxt/useMeat.ts';
import meat from '../../../src/meat.ts';

const count = useMeat('count');

function increment() {
  meat.set('count', count.value + 1);
}
</script>

<template>
  <main>
    <h1>MEAT + Nuxt Demo</h1>
    <button @click="increment">Increment</button>
    <p>MEAT count: {{ count }}</p>
  </main>
</template>
