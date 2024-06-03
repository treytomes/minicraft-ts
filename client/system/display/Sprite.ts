import {GameTime} from '../GameTime';
import {Point, Rectangle} from '../math/index';
import Color from './Color';
import {PALETTE} from './palette';
import TileSet from './TileSet';

/**
 * A colored group of tiles that can move around.
 */
export default class Sprite {
  tileset: TileSet;
  tileIndex: number;
  size: number;
  position: Point;
  speed: Point;
  colors: Color[];

  constructor(
    tileset: TileSet,
    xt: number,
    yt: number,
    colors: number[],
    size = 2
  ) {
    this.tileset = tileset;
    this.tileIndex = xt + yt * tileset.tilesPerRow;
    this.size = size;

    this.position = Point.zero;
    this.speed = Point.zero;
    this.colors = PALETTE.get(colors[0], colors[1], colors[2], colors[3]);
  }

  get bounds() {
    return new Rectangle(
      this.position.x,
      this.position.y,
      this.tileset.tileWidth * this.size,
      this.tileset.tileHeight * this.size
    );
  }

  update(time: GameTime) {
    this.position = this.position.add(this.speed.multiply(time.deltaTime));
  }

  moveTo(point: Point): void;
  moveTo(x: number, y: number): void;
  moveTo(xOrPoint: number | Point, y?: number) {
    if (xOrPoint instanceof Point) {
      this.position = xOrPoint;
      return;
    }
    this.position = new Point(xOrPoint, y!);
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  render(time: GameTime) {
    this.tileset.render({
      tileIndex: this.tileIndex,
      pnt: this.position,
      colors: this.colors,
    });
    if (this.size === 1) return;

    this.tileset.render({
      tileIndex: this.tileIndex + 1,
      x: this.position.x + this.tileset.tileWidth,
      y: this.position.y,
      colors: this.colors,
    });
    this.tileset.render({
      tileIndex: this.tileIndex + this.tileset.tilesPerRow,
      x: this.position.x,
      y: this.position.y + this.tileset.tileHeight,
      colors: this.colors,
    });
    this.tileset.render({
      tileIndex: this.tileIndex + this.tileset.tilesPerRow + 1,
      x: this.position.x + this.tileset.tileWidth,
      y: this.position.y + this.tileset.tileHeight,
      colors: this.colors,
    });
  }
}
