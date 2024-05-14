import { GameTime } from "../GameTime";
import { Rectangle } from "../math/index";
import Color from "./Color";
import { PALETTE } from "./palette";
import TileSet from "./TileSet";

/**
 * A colored group of tiles that can move around.
 * 
 * @property {TileSet} tileset The tileset that contains the tiles.
 * @property {number} tileIndex The tile index in the tileset.
 * @property {number} size The size of the sprite.
 * @property {number} x The X position.
 * @property {number} y The Y position.
 * @property {number} dx The X velocity.
 * @property {number} dy The Y velocity.
 * @property {number[]} colors The color values.
 */
export default class Sprite {
  tileset: TileSet;
  tileIndex: number;
  size: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  colors: Color[];

  /**
   * @param {TileSet} tileset The tileset that contains the tiles.
   * @param {number} xt X tile index.
   * @param {number} yt Y tile index.
   * @param {number} x X position.
   * @param {number} y Y position.
   * @param {number[]} colors An array of 4 RGB numbers.  Or -1 for transparent.
   */
  constructor(tileset: TileSet, xt: number, yt: number, colors: number[], size = 2) {
    this.tileset = tileset;
    this.tileIndex = xt + yt * tileset.tilesPerRow;
    this.size = size;

    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.colors = PALETTE.get4(colors[0], colors[1], colors[2], colors[3]);
  }

  get bounds() {
    return new Rectangle(this.x, this.y, this.tileset.tileWidth * this.size, this.tileset.tileHeight * this.size);
  }

  update(time: GameTime) {
    this.x += this.dx * time.deltaTime;
    this.y += this.dy * time.deltaTime;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  render(time: GameTime) {
    this.tileset.render(this.tileIndex, this.x, this.y, this.colors);
    if (this.size == 1) return;

    this.tileset.render(this.tileIndex + 1, this.x + this.tileset.tileWidth, this.y, this.colors);
    this.tileset.render(this.tileIndex + this.tileset.tilesPerRow, this.x, this.y + this.tileset.tileHeight, this.colors);
    this.tileset.render(this.tileIndex + this.tileset.tilesPerRow + 1, this.x + this.tileset.tileWidth, this.y + this.tileset.tileHeight, this.colors);
  }
}
