import { defineConfig } from 'vite';
import qwik from '@builder.io/qwik/optimizer';
import qwikCity from '@builder.io/qwik-city/vite';

export default defineConfig({
  plugins: [qwikCity(), qwik()]
});
