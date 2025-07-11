// src/plugins/astro/meatAstroPlugin.ts
import meat from '../../meat.ts';
import type { AstroIntegration } from 'astro';

export default function meatAstroPlugin(): AstroIntegration {
  return {
    name: 'meat:astro',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript('page', `window.meat = ${JSON.stringify(meat.getState())}`);
      }
    }
  };
}
