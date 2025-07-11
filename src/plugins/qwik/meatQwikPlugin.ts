// src/plugins/qwik/meatQwikPlugin.ts
import meat from '../../meat.ts';

export function meatQwikPlugin() {
  return {
    provide: { meat }
  };
}
