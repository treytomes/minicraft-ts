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

  static get zero(): Rectangle {
    return new Rectangle(0, 0, 0, 0);
  }

  get left(): number {
    return this.x;
  }

  get right(): number {
    return this.x + this.width - 1;
  }

  get top(): number {
    return this.y;
  }

  get bottom(): number {
    return this.y + this.height - 1;
  }

  get centerX(): number {
    return Math.floor((this.left + this.right) / 2);
  }

  get centerY(): number {
    return Math.floor((this.top + this.bottom) / 2);
  }

  contains(x: number, y: number): boolean {
    return (
      isInRange(x, this.left, this.right + 1) &&
      isInRange(y, this.top, this.bottom + 1)
    );
  }

  intersects(x0: number, y0: number, x1: number, y1: number): boolean;
  intersects(r: Rectangle): boolean;
  intersects(
    x0OrRect: number | Rectangle,
    y0?: number,
    x1?: number,
    y1?: number
  ): boolean {
    if (x0OrRect instanceof Rectangle) {
      const r = x0OrRect;
      return this.intersects(r.left, r.top, r.right, r.bottom);
    }
    return !(
      this.right < x0OrRect ||
      this.bottom < y0! ||
      this.left > x1! ||
      this.top > y1!
    );
  }

  scale(n: number): Rectangle {
    return new Rectangle(
      this.x + this.width * n,
      this.y + this.height * n,
      this.width * n * 2,
      this.height * n * 2
    );
  }

  resize(w: number, h: number): Rectangle {
    return new Rectangle(this.x, this.y, w, h);
  }
}
