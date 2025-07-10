<template>
  <div class="counter">
    <button @click="$meat.set('count', count + 1)">
      Count: {{ count }}
    </button>
    <p>
      Theme: {{ theme }}
      <select v-model="theme" @change="$meat.set('theme', theme)">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </p>
  </div>
</template>

<script setup>
import { useMeat } from '../src/plugins/vue/useMeat.js';

const count = useMeat('count');
const theme = useMeat('theme');
</script>

<style scoped>
.counter {
  padding: 1rem;
  font-family: sans-serif;
}
button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
}
select {
  margin-left: 0.5rem;
}
</style>
