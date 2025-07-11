import { createSignal, onCleanup } from 'solid-js';
import meat from '../../../src/meat.ts';

export function useMeat(key: string) {
  const [value, setValue] = createSignal(meat.get(key));
  const unsubscribe = meat.subscribe(key, setValue);
  onCleanup(unsubscribe);
  return value;
}
