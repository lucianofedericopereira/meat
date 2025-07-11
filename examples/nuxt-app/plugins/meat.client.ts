import meat from '../../../src/meat.ts';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('meat', meat);
});
