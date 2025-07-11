// src/plugins/nuxt/useMeat.ts
import { ref, onMounted } from 'vue';
import meat from '../../meat.ts';

export function useMeat(key: string) {
  const value = ref(meat.get(key));

  onMounted(() => {
    meat.subscribe(key, val => value.value = val);
  });

  return value;
}
