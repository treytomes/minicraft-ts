export default class Point {
  readonly x: number;
  readonly y: number;

  /**
   * @param {number} x The x-position.
   * @param {number} y The y-position.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * @returns {Point}
   */
  static get zero(): Point {
    return new Point(0, 0);
  }

  /**
   * @returns {Point}
   */
  static get unitX(): Point {
    return new Point(1, 0);
  }

  /**
   * @returns {Point}
   */
  static get unitY(): Point {
    return new Point(0, 1);
  }

  /**
   * @returns {Point}
   */
  get negate(): Point {
    return new Point(-this.x, -this.y);
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

  /**
   * @param {number} value Scalar value to multiply by.
   * @returns {Point} A new point.
   */
  multiply(value: number): Point {
    return new Point(this.x * value, this.y * value);
  }
}
