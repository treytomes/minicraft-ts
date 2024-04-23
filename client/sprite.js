import { Rectangle } from "./math/index.js";
import { PALETTE } from "./palette.js";

export class Sprite {
  /**
   * @param {number} x X position.
   * @param {number} y Y position.
   * @param {colors} colors An array of 4 RGB numbers.  Or -1 for transparent.
   */
  constructor(tileset, xt, yt, colors, size = 2) {
    this.tileset = tileset;
    this.tileIndex = xt + yt * tileset.tilesPerRow;
    this.size = size;

    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.colors = PALETTE.get4(...colors);
  }

  get bounds() {
    return new Rectangle(this.x, this.y, this.tileset.tileWidth * this.size, this.tileset.tileHeight * this.size);
  }

  update(deltaTime) {
    this.x += this.dx * deltaTime;
    this.y += this.dy * deltaTime;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  render() {
    this.tileset.drawTile(this.tileIndex, this.x, this.y, this.colors);
    if (this.size == 1) return;

    this.tileset.drawTile(this.tileIndex + 1, this.x + this.tileset.tileWidth, this.y, this.colors);
    this.tileset.drawTile(this.tileIndex + this.tileset.tilesPerRow, this.x, this.y + this.tileset.tileHeight, this.colors);
    this.tileset.drawTile(this.tileIndex + this.tileset.tilesPerRow + 1, this.x + this.tileset.tileWidth, this.y + this.tileset.tileHeight, this.colors);
  }
}
