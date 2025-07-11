import { Component } from 'solid-js';
import { useMeat } from './useMeat';
import meat from '../../../src/meat.ts';

const App: Component = () => {
  const count = useMeat('count');

  return (
    <main>
      <h1>MEAT + SolidJS Demo</h1>
      <button onClick={() => meat.set('count', count() + 1)}>Increment</button>
      <p>MEAT count: {count()}</p>
    </main>
  );
};

export default App;
