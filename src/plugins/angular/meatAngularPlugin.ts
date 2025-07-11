// src/plugins/angular/meatAngularPlugin.ts
import { Injectable } from '@angular/core';
import meat from '../../meat.ts'; // Shared typed MEAT core

@Injectable({
  providedIn: 'root'
})
export class MeatService {
  get(key: string) {
    return meat.get(key);
  }

  set(key: string, value: any) {
    meat.set(key, value);
  }

  subscribe(key: string, handler: (value: any) => void) {
    return meat.subscribe(key, handler);
  }

  watch(key: string, handler: (value: any) => void) {
    return meat.watch(key, handler);
  }
}
