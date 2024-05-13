export default class Color {
  r: number;
  g: number;
  b: number;
  readonly a: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255;
  }
};