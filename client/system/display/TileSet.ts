import {getHeight, getWidth, setPixel} from './index';
import Image from './Image';
import Color from './Color';
import {Point} from '../math';
import Resource from '../data/resources/Resource';

export const BIT_MIRROR_X = 0x01;
export const BIT_MIRROR_Y = 0x02;

type TileSetProps = {
  imagePath: string;
  tileWidth: number;
  tileHeight: number;
};

type RenderPropsWithXY = {
  tileIndex: number;
  x: number;
  y: number;
  colors: Color[];
  bits?: number;
};

type RenderPropsWithPoint = {
  tileIndex: number;
  pnt: Point;
  colors: Color[];
  bits?: number;
};

type RenderProps = RenderPropsWithXY | RenderPropsWithPoint;

export default class TileSet extends Resource<TileSetProps> {
  private props!: TileSetProps;

  tiles!: number[][];
  tilesPerRow!: number;

  get tileWidth() {
    return this.props.tileWidth;
  }

  get tileHeight() {
    return this.props.tileHeight;
  }

  async loadContent(props: TileSetProps) {
    this.props = props;
    const image = await window.resources.load(Image, this.props.imagePath);

    this.tilesPerRow = Math.floor(image.width / this.tileWidth);
    this.tiles = [];

    const columns = Math.floor(image.width / this.tileWidth);
    const rows = Math.floor(image.height / this.tileHeight);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = column * this.tileWidth;
        const y = row * this.tileHeight;
        const tile: number[] = [];
        for (let yd = 0; yd < this.tileHeight; yd++) {
          for (let xd = 0; xd < this.tileWidth; xd++) {
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

  render(props: RenderProps) {
    const tileIndex = props.tileIndex;
    const colors = props.colors;
    const bits = props.bits ?? 0;

    const x = Math.floor(
      (props as RenderPropsWithXY)?.x ?? (props as RenderPropsWithPoint)?.pnt.x
    );

    const y = Math.floor(
      (props as RenderPropsWithXY).y ?? (props as RenderPropsWithPoint)?.pnt.y
    );

    const mirrorX = (bits & BIT_MIRROR_X) > 0;
    const mirrorY = (bits & BIT_MIRROR_Y) > 0;

    const tile = this.tiles[tileIndex];

    for (let yd = 0; yd < this.tileHeight; yd++) {
      if (yd + y < 0 || yd + y >= getHeight()) {
        continue;
      }

      let ys = yd;
      if (mirrorY) ys = this.tileHeight - 1 - yd;

      for (let xd = 0; xd < this.tileWidth; xd++) {
        if (xd + x < 0 || xd + x >= getWidth()) {
          continue;
        }

        let xs = xd;
        if (mirrorX) xs = this.tileWidth - 1 - xd;

        const index = ys * this.tileWidth + xs;
        const v = tile[index];
        const c = colors[v];
        if (c) setPixel(xd + x, yd + y, c);
      }
    }
  }

  // render_v1(tileIndex: number, pnt: Point, colors: Color[], bits: number): void;
  // render_v1(tileIndex: number, pnt: Point, colors: Color[]): void;
  // render_v1(
  //   tileIndex: number,
  //   x: number,
  //   y: number,
  //   colors: Color[],
  //   bits: number
  // ): void;
  // render_v1(tileIndex: number, x: number, y: number, colors: Color[]): void;
  // render_v1(
  //   tileIndex: number,
  //   xOrPnt: number | Point,
  //   yOrColors: number | Color[],
  //   colorsOrBits: Color[] | number = 0,
  //   bits: number | undefined = 0
  // ) {
  //   if (xOrPnt instanceof Point) {
  //     this.render(
  //       tileIndex,
  //       xOrPnt.x,
  //       xOrPnt.y,
  //       yOrColors as Color[],
  //       colorsOrBits as number
  //     );
  //     return;
  //   }

  //   const mirrorX = (bits & BIT_MIRROR_X) > 0;
  //   const mirrorY = (bits & BIT_MIRROR_Y) > 0;

  //   const x = Math.floor(xOrPnt);
  //   const y = Math.floor(yOrColors as number);
  //   const colors = colorsOrBits as Color[];

  //   const tile = this.tiles[tileIndex];

  //   for (let yd = 0; yd < this.tileHeight; yd++) {
  //     if (yd + y < 0 || yd + y >= getHeight()) {
  //       continue;
  //     }

  //     let ys = yd;
  //     if (mirrorY) ys = this.tileHeight - 1 - yd;

  //     for (let xd = 0; xd < this.tileWidth; xd++) {
  //       if (xd + x < 0 || xd + x >= getWidth()) {
  //         continue;
  //       }

  //       let xs = xd;
  //       if (mirrorX) xs = this.tileWidth - 1 - xd;

  //       const index = ys * this.tileWidth + xs;
  //       const v = tile[index];
  //       const c = colors[v];
  //       if (c) setPixel(xd + x, yd + y, c);
  //     }
  //   }
  // }
}
