import {isInRange} from './index';

export default class Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * @returns {Rectangle}
   */
  static get zero(): Rectangle {
    return new Rectangle(0, 0, 0, 0);
  }

  /**
   * @returns {number}
   */
  get left(): number {
    return this.x;
  }

  /**
   * @returns {number}
   */
  get right(): number {
    return this.x + this.width - 1;
  }

  /**
   * @returns {number}
   */
  get top(): number {
    return this.y;
  }

  /**
   * @returns {number}
   */
  get bottom(): number {
    return this.y + this.height - 1;
  }

  /**
   * @returns {number}
   */
  get centerX(): number {
    return Math.floor((this.left + this.right) / 2);
  }

  /**
   * @returns {number}
   */
  get centerY(): number {
    return Math.floor((this.top + this.bottom) / 2);
  }

  /**
   * @returns {boolean}
   */
  contains(x: number, y: number): boolean {
    return (
      isInRange(x, this.left, this.right + 1) &&
      isInRange(y, this.top, this.bottom + 1)
    );
  }

  /**
   * @returns {Rectangle}
   */
  scale(n: number): Rectangle {
    return new Rectangle(
      this.x + this.width * n,
      this.y + this.height * n,
      this.width * n * 2,
      this.height * n * 2
    );
  }

  /**
   * @returns {Rectangle}
   */
  resize(w: number, h: number): Rectangle {
    return new Rectangle(this.x, this.y, w, h);
  }
}
