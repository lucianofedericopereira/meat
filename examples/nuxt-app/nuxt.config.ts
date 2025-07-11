import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  typescript: {
    strict: true
  },
  plugins: ['~/plugins/meat.client.ts']
});
