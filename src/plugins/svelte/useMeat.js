// src/plugins/svelte/useMeat.js
import { readable } from 'svelte/store';
import meat from '../../meat.ts';

export function useMeat(key) {
  return readable(meat.get(key), set => {
    const unsubscribe = meat.subscribe(key, set);
    return unsubscribe;
  });
}
