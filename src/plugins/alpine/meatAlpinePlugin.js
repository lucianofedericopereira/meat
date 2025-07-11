import meat from '../../meat.js';

export function meatAlpinePlugin() {
  return {
    init(el, { expression }, { evaluateLater, effect }) {
      const get = evaluateLater(expression);
      effect(() => {
        get(value => {
          meat.set('alpineState', value);
        });
      });
    }
  };
}
