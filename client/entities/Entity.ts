import {Camera} from '../Camera';
import {Direction} from '../Direction';
import Level from '../Level';
import Item from '../items/Item';
import {GameTime} from '../system/GameTime';
import {TileSet} from '../system/display';
import {Point, Rectangle} from '../system/math';
import {Tile} from '../tiles/Tile';
import ItemEntity from './ItemEntity';
import Mob from './Mob';
import Player from './Player';

// TODO: Finish implementing Entity.
export default class Entity {
  level?: Level;
  removed = false;

  isSwimming = false;

  tickTime = 0;

  /**
   * The entity is rendered centered on this position.
   */
  position: Point;

  maxSpeed = 0.05;

  currentSpeed: Point;
  size: Point;
  dir = Direction.South;
  /**
   * Updated for every pixel the entity moves.
   * This is really only used to help track the current animation frame.
   */
  walkDist = 0;

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

  get lightRadius() {
    return 0;
  }

  constructor() {
    this.position = Point.zero;

    this.size = new Point(12, 12);
    this.currentSpeed = Point.zero;
  }

  remove() {
    this.removed = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  blocks(e: Entity): boolean {
    return false;
  }

  interact(player: Player, item: Item, attackDir: Direction): boolean {
    return item.interact(player, this, attackDir);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  touchedBy(entity: Entity): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  touchItem(itemEntity: ItemEntity) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUsed(player: Player, attackDir: Direction): boolean {
    return false;
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
    if (!this.level) return;
    if (!(xOrPoint instanceof Point)) {
      this.moveBy(new Point(xOrPoint, y!));
      return;
    }
    const delta = xOrPoint;
    const length = delta.length;

    // This will get toggled to true if the entity steps on a liquid tile.
    this.isSwimming = false;

    if (length !== 0) {
      this.walkDist += xOrPoint.length;
      if (delta.x < 0) this.dir = Direction.West;
      if (delta.x > 0) this.dir = Direction.East;
      if (delta.y < 0) this.dir = Direction.North;
      if (delta.y > 0) this.dir = Direction.South;
    }

    const xto0 = Math.floor(this.bounds.left / 16);
    const yto0 = Math.floor(this.bounds.top / 16);
    const xto1 = Math.floor(this.bounds.right / 16);
    const yto1 = Math.floor(this.bounds.bottom / 16);

    const xt0 = Math.floor((this.bounds.left + delta.x) / 16);
    const yt0 = Math.floor((this.bounds.top + delta.y) / 16);
    const xt1 = Math.floor((this.bounds.right + delta.x) / 16);
    const yt1 = Math.floor((this.bounds.bottom + delta.y) / 16);
    let isBlocked = false;
    for (let yt = yt0; yt <= yt1; yt++) {
      for (let xt = xt0; xt <= xt1; xt++) {
        if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) continue;
        this.level.getTile(xt, yt).bumpedInto(this.level, xt, yt, this);
        if (!this.level.getTile(xt, yt).mayPass(this.level, xt, yt, this)) {
          isBlocked = true;
          break;
        }
      }
      if (isBlocked) break;
    }

    const wasInside = this.level.getEntities(
      this.bounds.left,
      this.bounds.top,
      this.bounds.right,
      this.bounds.bottom
    );
    const isInside = this.level.getEntities(
      this.bounds.left + delta.x,
      this.bounds.top + delta.y,
      this.bounds.right + delta.x,
      this.bounds.bottom + delta.y
    );
    for (let i = 0; i < isInside.length; i++) {
      const e = isInside[i];
      if (e === this) continue;

      e.touchedBy(this);

      if (wasInside.includes(e)) continue;
      // Only consider blocks for newly collided entities.

      if (e.blocks(this)) {
        isBlocked = true;
      }
    }

    if (!isBlocked) {
      const xt = Math.floor(this.position.x / Tile.width);
      const yt = Math.floor(this.position.y / Tile.height);
      this.level.getTile(xt, yt).steppedOn(this.level, xt, yt, this);
      this.moveTo(this.position.add(delta));
    }
  }

  hurt(mob: Mob, dmg: number, attackDir: Direction): void;
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
  update(time: GameTime) {
    this.tickTime += time.deltaTime;
    const delta = this.currentSpeed.multiply(time.deltaTime);
    this.moveBy(delta.x, 0);
    this.moveBy(0, delta.y);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(tileset: TileSet, camera: Camera) {}
}
