import meat from '../../meat.ts';

export function meatSolidPlugin() {
  return {
    provide: { meat }
  };
}
