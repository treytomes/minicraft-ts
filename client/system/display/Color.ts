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

  equals(color: Color) {
    return (
      this.r === color.r &&
      this.g === color.g &&
      this.b === color.b &&
      this.a === color.a
    );
  }
}
