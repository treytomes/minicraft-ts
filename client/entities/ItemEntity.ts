import {Camera} from '../Camera';
import Item from '../items/Item';
import {GameTime} from '../system/GameTime';
import {Sound} from '../system/audio/sound';
import {PALETTE, TileSet} from '../system/display';
import {Point} from '../system/math';
import Random from '../system/math/Random';
import Entity from './Entity';
import Mob from './Mob';
import Player from './Player';

export default class ItemEntity extends Entity {
  private lifeTime: number;
  public hurtTime = 0;
  protected xKnockback = 0;
  protected yKnockback = 0;
  public xa: number;
  public ya: number;
  public za: number;
  public xx: number;
  public yy: number;
  public zz: number;
  public item: Item;
  private time = 0;

  constructor(item: Item, x: number, y: number) {
    super();

    this.item = item;
    this.moveTo(x, y);
    this.xx = x;
    this.yy = y;

    this.size = new Point(6, 6);

    this.zz = 2;
    this.xa = Random.nextGaussian() * 0.3;
    this.ya = Random.nextGaussian() * 0.2;
    this.za = Random.nextFloat() * 0.7 + 1;

    this.lifeTime = 3000 + Random.nextInt(3000);
  }

  update(time: GameTime) {
    this.time += time.deltaTime;
    if (this.time >= this.lifeTime) {
      this.remove();
      return;
    }
    this.xx += this.xa;
    this.yy += this.ya;
    this.zz += this.za;
    if (this.zz < 0) {
      this.zz = 0;

      this.za *= -time.deltaTime / 64;
      this.xa *= time.deltaTime / 32;
      this.ya *= time.deltaTime / 32;
    }
    this.za -= time.deltaTime / 128;

    const ox = this.position.x;
    const oy = this.position.y;
    const nx = Math.floor(this.xx);
    const ny = Math.floor(this.yy);
    const expectedX = nx - this.position.x;
    const expectedY = ny - this.position.y;
    this.moveBy(nx - this.position.x, ny - this.position.y);
    const gotX = this.position.x - ox;
    const gotY = this.position.y - oy;
    this.xx += gotX - expectedX;
    this.yy += gotY - expectedY;

    if (this.hurtTime > 0) this.hurtTime -= time.deltaTime;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isBlockableBy(mob: Mob): boolean {
    return false;
  }

  render(tileset: TileSet, camera: Camera) {
    if (this.time >= (this.lifeTime * 2) / 3) {
      // Blink the item as it near death.
      if ((this.time >> 3) % 2 === 0) return;
    }

    const renderPosition = camera.translate(
      this.position.subtract(new Point(4, 4))
    );

    tileset.render({
      pnt: renderPosition,
      tileIndex: this.item.icon,
      colors: PALETTE.get(-1, 0, 0, 0),
    });
    tileset.render({
      pnt: renderPosition.subtract(Point.unitY.multiply(Math.floor(this.zz))),
      tileIndex: this.item.icon,
      colors: this.item.color,
    });
  }

  touchedBy(entity: Entity) {
    if (this.time > 30) entity.touchItem(this);
  }

  take(player: Player) {
    Sound.pickup.play();
    player.score++;
    this.item.onTake(this);
    this.remove();
  }
}
