import { isInRange } from "./more_math.js";

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

	static get zero() {
		return new Rectangle(0, 0, 0, 0);
	}

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}

	get left() {
		return this.#x;
	}

	get right() {
		return this.#x + this.#width - 1;
	}

	get top() {
		return this.#y;
	}

	get bottom() {
		return this.#y + this.#height - 1;
	}

	get centerX() {
		return Math.floor((this.left + this.right) / 2);
	}

	get centerY() {
		return Math.floor((this.top + this.bottom) / 2);
	}

  contains(x, y) {
		return isInRange(x, this.left, this.right + 1) && isInRange(y, this.top, this.bottom + 1);
	}

	scale(n) {
		return new Rectangle(
			this.x + this.width * n,
			this.y + this.height * n,
			this.width * n * 2,
			this.height * n * 2,
		);
	}

	resize(w, h) {
		return new Rectangle(
			this.x,
			this.y,
			w,
			h,
		);
	}
}