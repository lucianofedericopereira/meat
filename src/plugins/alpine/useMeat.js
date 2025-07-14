import { meatAlpinePlugin } from './meatAlpinePlugin.js';
export function useMeatAlpine(key, expression) {
    return {
      init(el, { evaluateLater, effect }) {
        const get = evaluateLater(expression);
        effect(() => {
          get(value => {
            meat.set(key, value);
          });
        });
      }
    };
}