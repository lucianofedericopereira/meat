# 🅰️ Angular Plugin for MEAT

Angular is a full-featured frontend framework ideal for enterprise apps. While it doesn’t support simple hooks or magic methods like other frameworks, MEAT integrates smoothly using Angular services and RxJS observables.

---

## 🧩 Plugin Setup

Install and register MEAT in your app:

```ts
import { MeatService } from '../../src/plugins/angular/meatAngularPlugin';
import meat from '../../meat.ts';
```

Inject `MeatService` into your component:

```ts
constructor(private meat: MeatService) {}
```

---

## 🚀 Example Component

```ts
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
```

---

## 🧪 Testing

See [`test/angular.test.ts`](../../test/angular.test.ts) for basic service validation:
- Confirms Angular can read and write MEAT state
- Verifies subscription updates reflect reactivity

---

## 📂 Demo

Try the example in [`examples/angular-demo/`](../../examples/angular-demo/) to see MEAT state bound to Angular UI.

---

## ✅ Summary

✅ Reactive sync via Angular services  
✅ RxJS support via `useMeat.ts`  
✅ Ideal for large-scale apps and admin dashboards  
✅ Type-safe and scoped integration
