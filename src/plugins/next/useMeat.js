// src/plugins/next/useMeat.ts
import { useEffect, useState } from 'react';
import meat from '../../meat.ts';

export function useMeat(key: string) {
  const [value, setValue] = useState(meat.get(key));

  useEffect(() => {
    const unsubscribe = meat.subscribe(key, setValue);
    return unsubscribe;
  }, [key]);

  return value;
}
