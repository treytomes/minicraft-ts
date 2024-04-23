export const isInRange = (value, inclusiveMin, exclusiveMax) => {
  return (inclusiveMin <= value) && (value < exclusiveMax);
}

/**
 * Linear interpolation by t-% from a to b.
 */
export const lerp = (t, a, b) => {
  return a + t * (b - a);
}
