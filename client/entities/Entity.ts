import Level from '../Level';
import {GameTime} from '../system/GameTime';
import {TileSet} from '../system/display';
import {Point, Rectangle} from '../system/math';
import {Tile} from '../tiles/Tile';
import Mob from './Mob';

// TODO: Finish implementing Entity.
export default class Entity {
  level: Level | undefined;

  /**
   * The entity is rendered centered on this position.
   */
  position: Point;

  speed: Point;
  size: Point;

  get bounds() {
    return new Rectangle(
      this.position.x - this.size.x / 2,
      this.position.y - this.size.y / 2,
      this.size.x,
      this.size.y
    );
  }

  get canSwim() {
    return false;
  }

  constructor(x: number, y: number) {
    this.position = new Point(x, y);
    this.size = new Point(16, 16);
    this.speed = Point.zero;
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

  moveBy(point: Point): void;
  moveBy(x: number, y: number): void;
  moveBy(xOrPoint: number | Point, y?: number) {
    if (xOrPoint instanceof Point) {
      this.position = xOrPoint;
      return;
    }
    this.position = new Point(this.position.x + xOrPoint, this.position.y + y!);
  }

  hurt(mob: Mob, dmg: number, attackDir: number): void;
  hurt(tile: Tile, x: number, y: number, dmg: number): void;
  hurt(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mobOrTile: Mob | Tile,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dmgOrX: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDirOrY: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dmg?: number
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: GameTime): void {
    this.position = this.position.add(this.speed.multiply(time.deltaTime));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(tileset: TileSet) {}
}
