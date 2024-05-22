export const css = {
  percent: (value: number) => `${value * 100}%`,
  pixels: (value: number) => `${value}px`,
  subtract: (a: number, b: number) => `calc(${a} - ${b})`,
};
