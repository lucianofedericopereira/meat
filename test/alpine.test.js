// test/alpine.test.js

import { meatAlpinePlugin } from '../src/plugins/alpine/meatAlpinePlugin.js';
import Alpine from 'alpinejs';

// Simulate Alpine plugin registration
Alpine.plugin(meatAlpinePlugin);
Alpine.start();

// Simulate MEAT state update
meat.set('count', 42);

// Check if MEAT is accessible via Alpine magic
const div = document.createElement('div');
div.setAttribute('x-data', '');
document.body.appendChild(div);
Alpine.initializeComponent(div);

const meatMagic = Alpine.evaluate(div, '$meat.get("count")');
console.log('Alpine magic $meat count:', meatMagic);

console.assert(meatMagic === 42, '$meat should return synced MEAT value');
console.log('✅ Alpine integration test passed.');
