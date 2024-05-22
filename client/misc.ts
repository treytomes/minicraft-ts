import {Color, drawCircle, getHeight, getWidth} from './system/display';

export class Ball {
  r: number;
  x: number;
  y: number;
  color: Color;
  dx: number;
  dy: number;

  constructor(x = undefined, y = undefined, r = undefined, color = undefined) {
    this.r = r ?? Math.random() * 20 + 10;
    this.x = x ?? Math.random() * getWidth();
    this.y = y ?? Math.random() * getHeight();

    if (this.x - this.r < 0) {
      this.x = this.r;
    } else if (this.x + this.r >= getWidth()) {
      this.x = getWidth() - this.r;
    }
    if (this.y - this.r < 0) {
      this.y = this.r;
    } else if (this.y + this.r >= getHeight()) {
      this.y = getHeight() - this.r;
    }

    this.color =
      color ??
      new Color(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
      );

    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
  }

  draw() {
    drawCircle(this.x, this.y, this.r, this.color);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x - this.r <= 0 || this.x + this.r > getWidth()) {
      this.dx = -this.dx;
    }
    if (this.y - this.r <= 0 || this.y + this.r > getHeight()) {
      this.dy = -this.dy;
    }
  }
}
