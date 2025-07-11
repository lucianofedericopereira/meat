// src/plugins/svelte/meatSveltePlugin.js
import meat from '../../meat.ts';

export default function meatSveltePlugin(app, options = {}) {
  app.meat = meat;
  meat.config.debug = options.debug ?? false;
}
