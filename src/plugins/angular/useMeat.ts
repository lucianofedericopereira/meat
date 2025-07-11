// src/plugins/angular/useMeat.ts
import { BehaviorSubject } from 'rxjs';
import meat from '../alpine/meat.ts';

export function useMeat(key: string) {
  const subject = new BehaviorSubject(meat.get(key));
  meat.subscribe(key, value => subject.next(value));
  return subject.asObservable();
}
