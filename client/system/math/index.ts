import Point from './Point';
import Rectangle from './Rectangle';

/**
 * Check if value is in range [inclusiveMin, exclusiveMax).
 */
export const isInRange = (
  value: number,
  inclusiveMin: number,
  exclusiveMax: number
): boolean => {
  return inclusiveMin <= value && value < exclusiveMax;
};

/**
 * Linear interpolation by t-% from a to b.
 */
export const lerp = (t: number, a: number, b: number): number => {
  return a + t * (b - a);
};

export {Point, Rectangle};
