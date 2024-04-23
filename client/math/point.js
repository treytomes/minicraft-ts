export default class Point {
  #x;
  #y;

  /**
   * 
   * @param {number} x The x-position.
   * @param {number} y The y-position.
   */
	constructor(x, y) {
		this.#x = x;
		this.#y = y;
	}

	get x() {
		return this.x;
	}

	get y() {
		return this.#y;
	}

	static get zero() {
		return new Point(0, 0);
	}

	static get unitX() {
		return new Point(1, 0);
	}

	static get unitY() {
		return new Point(0, 1);
	}

	get negate() {
		return new Point(-this.#x, -this.#y);
	}

  /**
   * Add 2 points together.
   * 
   * @param {Point} p The point to add.
   * @returns A new point.
   */
	add(p) {
		return new Point(this.#x + p.#x, this.#y + p.#y);
	}

  /**
   * @param {number} value Scalar value to multiply by.
   * @returns {Point} A new point.
   */
	multiply(value) {
		return new Point(this.#x * value, this.#y * value);
	}
}