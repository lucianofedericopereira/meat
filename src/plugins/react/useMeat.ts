import { useEffect, useState } from 'react';
import meat from '../../meat.ts';

export function useMeat<T = unknown>(key: string): T {
  const [value, setValue] = useState<T>(meat.get(key));

  useEffect(() => {
    const unsubscribe = meat.subscribe(key, setValue);
    return unsubscribe;
  }, [key]);

  return value;
}
