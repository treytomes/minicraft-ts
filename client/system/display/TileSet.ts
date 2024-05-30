import {getHeight, getWidth, setPixel} from './index';
import Image from './Image';
import Color from './Color';
import {Point} from '../math';

export const BIT_MIRROR_X = 0x01;
export const BIT_MIRROR_Y = 0x02;

/**
 * @property {number} tileWidth Tile width.
 * @property {number} tileHeight Tile height.
 * @property {number} tilesPerRow Number of tiles per row.
 */
export default class TileSet {
  tiles: number[][];

  tileWidth: number;
  tileHeight: number;
  tilesPerRow: number;

  /**
   * @param {Image} image The source image to pull tiles from.
   * @param {number} tileWidth Tile width.
   * @param {number} tileHeight Tile height.
   */
  constructor(image: Image, tileWidth: number, tileHeight: number) {
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
        const tile: number[] = [];
        for (let yd = 0; yd < tileHeight; yd++) {
          for (let xd = 0; xd < tileWidth; xd++) {
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            const {r, g, b} = image.getPixel(x + xd, y + yd);
            const v = Math.floor(r / 64);
            tile.push(v);
          }
        }

        this.tiles.push(tile);
      }
    }
  }

  render(tileIndex: number, pnt: Point, colors: Color[], bits: number): void;
  render(tileIndex: number, pnt: Point, colors: Color[]): void;
  render(
    tileIndex: number,
    x: number,
    y: number,
    colors: Color[],
    bits: number
  ): void;
  render(tileIndex: number, x: number, y: number, colors: Color[]): void;
  render(
    tileIndex: number,
    xOrPnt: number | Point,
    yOrColors: number | Color[],
    colorsOrBits: Color[] | number = 0,
    bits: number | undefined = 0
  ) {
    if (xOrPnt instanceof Point) {
      this.render(
        tileIndex,
        xOrPnt.x,
        xOrPnt.y,
        yOrColors as Color[],
        colorsOrBits as number
      );
      return;
    }

    const mirrorX = (bits & BIT_MIRROR_X) > 0;
    const mirrorY = (bits & BIT_MIRROR_Y) > 0;

    const x = Math.floor(xOrPnt);
    const y = Math.floor(yOrColors as number);
    const colors = colorsOrBits as Color[];

    const tile = this.tiles[tileIndex];
    let index = 0;
    for (let yd = 0; yd < this.tileHeight; yd++) {
      let ys = y + yd;
      if (mirrorY) ys = y + (this.tileHeight - yd - 1);
      if (ys < 0) {
        index += this.tileWidth;
        continue;
      }
      if (ys >= getHeight()) continue;

      for (let xd = 0; xd < this.tileWidth; xd++) {
        let xs = x + xd;
        if (mirrorX) xs = x + (this.tileWidth - xd - 1);
        if (xs < 0) {
          index++;
          continue;
        }
        // if (xs >= getWidth()) {
        //   const remaining = this.tileWidth - xd;
        //   index += remaining;
        //   continue;
        // }

        const v = tile[index++];
        const c = colors[v];
        if (c) setPixel(xs, ys, c);
      }
    }
  }
}
