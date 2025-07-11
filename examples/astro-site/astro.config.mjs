import { defineConfig } from 'astro/config';
import meatAstroPlugin from '../src/plugins/astro/meatAstroPlugin.ts';

export default defineConfig({
  integrations: [meatAstroPlugin()]
});
