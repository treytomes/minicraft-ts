/**
 * @property {number} r Red.
 * @property {number} g Green.
 * @property {number} b Blue.
 * @property {number} a Alpha.
 */
export default class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255;
  }
};