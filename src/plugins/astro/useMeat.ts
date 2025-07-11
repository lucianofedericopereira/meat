// src/plugins/astro/useMeat.ts
import meat from '../../meat.ts';

export function useMeat(key: string) {
  return {
    get: () => meat.get(key),
    set: (value: any) => meat.set(key, value),
    subscribe: (handler: (value: any) => void) => meat.subscribe(key, handler)
  };
}
