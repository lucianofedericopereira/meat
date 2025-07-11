// src/plugins/next/meatNextPlugin.ts
import meat from '../../meat.ts';

export function meatNextPlugin(app: any) {
  app.meat = meat;
}
