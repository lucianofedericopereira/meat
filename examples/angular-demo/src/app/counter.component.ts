import { Component, OnInit } from '@angular/core';
import { MeatService } from '../../../src/plugins/angular/meatAngularPlugin';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="increment()">Increment</button>
    <p>MEAT count: {{ count }}</p>
  `
})
export class CounterComponent implements OnInit {
  count = 0;

  constructor(private meat: MeatService) {}

  ngOnInit() {
    this.meat.subscribe('count', val => this.count = val);
  }

  increment() {
    this.meat.set('count', this.count + 1);
  }
}
