import Rectangle from './Rectangle';

export default class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static get zero(): Point {
    return new Point(0, 0);
  }

  static get unitX(): Point {
    return new Point(1, 0);
  }

  static get unitY(): Point {
    return new Point(0, 1);
  }

  get negate(): Point {
    return new Point(-this.x, -this.y);
  }

  get floor(): Point {
    return new Point(Math.floor(this.x), Math.floor(this.y));
  }

  /**
   * Add 2 points together.
   *
   * @param {Point} p The point to add.
   * @returns {Point} A new point.
   */
  add(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  subtract(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

  /**
   * @param {number} value Scalar value to multiply by.
   * @returns {Point} A new point.
   */
  multiply(value: number): Point {
    return new Point(this.x * value, this.y * value);
  }

  clamp(bounds: Rectangle): Point {
    return new Point(
      Math.max(Math.min(this.x, bounds.right), bounds.left),
      Math.max(Math.min(this.y, bounds.bottom), bounds.top)
    );
  }
}
