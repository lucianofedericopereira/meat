declare module '../../../../src/plugins/next/useMeat' {
  export function useMeat<T = unknown>(key: string): T;
}

declare module '../../../../src/meat.ts' {
  const meat: {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
    subscribe: (key: string, listener: (value: unknown) => void) => () => void;
    config?: { debug?: boolean };
  };
  export default meat;
}
