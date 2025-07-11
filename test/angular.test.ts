// test/angular.test.ts
import { MeatService } from '../src/plugins/angular/meatAngularPlugin';

const meatService = new MeatService();

meatService.set('theme', 'dark');
console.assert(meatService.get('theme') === 'dark', 'Angular MeatService should sync state');

meatService.subscribe('theme', val => {
  console.log('Angular MEAT theme:', val);
});

console.log('✅ Angular integration test passed.');
