import { isInRange } from "./index.js";

export default class Rectangle {
	#x;
	#y;
	#width;
	#height;
	
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
	constructor(x, y, width, height) {
		this.#x = x;
		this.#y = y;
		this.#width = width;
		this.#height = height;
	}

	/**
	 * @returns {Rectangle}
	 */
	static get zero() {
		return new Rectangle(0, 0, 0, 0);
	}

	/**
	 * @returns {number}
	 */
	get x() {
		return this.#x;
	}

	/**
	 * @returns {number}
	 */
	get y() {
		return this.#y;
	}

	/**
	 * @returns {number}
	 */
	get width() {
		return this.#width;
	}

	/**
	 * @returns {number}
	 */
	get height() {
		return this.#height;
	}

	/**
	 * @returns {number}
	 */
	get left() {
		return this.#x;
	}

	/**
	 * @returns {number}
	 */
	get right() {
		return this.#x + this.#width - 1;
	}

	/**
	 * @returns {number}
	 */
	get top() {
		return this.#y;
	}

	/**
	 * @returns {number}
	 */
	get bottom() {
		return this.#y + this.#height - 1;
	}

	/**
	 * @returns {number}
	 */
	get centerX() {
		return Math.floor((this.left + this.right) / 2);
	}

	/**
	 * @returns {number}
	 */
	get centerY() {
		return Math.floor((this.top + this.bottom) / 2);
	}

	/**
	 * @returns {boolean}
	 */
  contains(x, y) {
		return isInRange(x, this.left, this.right + 1) && isInRange(y, this.top, this.bottom + 1);
	}

	/**
	 * @returns {Rectangle}
	 */
	scale(n) {
		return new Rectangle(
			this.x + this.width * n,
			this.y + this.height * n,
			this.width * n * 2,
			this.height * n * 2,
		);
	}

	/**
	 * @returns {Rectangle}
	 */
	resize(w, h) {
		return new Rectangle(
			this.x,
			this.y,
			w,
			h,
		);
	}
}