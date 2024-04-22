import { setPixel } from "./display/index.js";

export class TileSet {
  /**
   * @param {Image} image The source image to pull tiles from.
   * @param {number} tileWidth Tile width.
   * @param {number} tileHeight Tile height.
   */
  constructor(image, tileWidth, tileHeight) {
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tilesPerRow = Math.floor(image.width / tileWidth);
    this.tiles = [];

    const NUM_COLUMNS = Math.floor(image.width / tileWidth);
    const NUM_ROWS = Math.floor(image.height / tileHeight);

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let column = 0; column < NUM_COLUMNS; column++) {
        const x = column * tileWidth;
        const y = row * tileHeight;
        const tile = [];
        for (let yd = 0; yd < tileHeight; yd++) {
          for (let xd = 0; xd < tileWidth; xd++) {
            const { r, g, b } = image.getPixel(x + xd, y + yd);
            const v = Math.floor(r / 64);
            tile.push(v);
          }
        }

        this.tiles.push(tile);
      }
    }
  }

  /**
   * 
   * @param {number} tileIndex Index into the tileset.
   * @param {number} x X-position to draw at.
   * @param {number} y Y-position to draw at.
   * @param {number[]} colors An array of 4 numbers that represents the color of the tile.  -1 is transparent.
   */
  drawTile(tileIndex, x, y, colors) {
    x = Math.floor(x);
    y = Math.floor(y);
    const tile = this.tiles[tileIndex];
    let index = 0;
    for (let yd = 0; yd < this.tileHeight; yd++) {
      for (let xd = 0; xd < this.tileWidth; xd++) {
        const v = tile[index++];
        const c = colors[v];
        if (c) setPixel(x + xd, y + yd, c);
      }
    }
  }
}
