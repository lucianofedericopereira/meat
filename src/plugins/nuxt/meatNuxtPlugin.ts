// src/plugins/nuxt/meatNuxtPlugin.ts
import meat from '../../meat.ts';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('meat', meat);
});
