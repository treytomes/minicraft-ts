import {Direction} from '../Direction';
import Level from '../Level';
import {GameTime} from '../system/GameTime';
import {Sound} from '../system/audio/sound';
import {PALETTE} from '../system/display';
import {Point} from '../system/math';
import {Tile} from '../tiles';
import Entity from './Entity';
import {TextParticle} from './particles';

// TODO: Finish implementing Mob.
export default class Mob extends Entity {
  public maxHealth = 10;
  public health = this.maxHealth;
  public hurtTime = 0;
  protected xKnockback = 0;
  protected yKnockback = 0;

  constructor() {
    super();
  }

  heal(heal: number) {
    if (this.hurtTime > 0) return;

    // TODO: Finish this after fully implementing particles.
    // level.add(
    //   new TextParticle(
    //     '' + heal,
    //     this.position.x,
    //     this.position.y,
    //     PALETTE.get(-1, 50, 50, 50)[0]
    //   )
    // );
    this.health += heal;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  hurt(level: Level, mob: Mob, dmg: number, attackDir: number): void;
  hurt(level: Level, tile: Tile, x: number, y: number, dmg: number): void;
  hurt(
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mobOrTile: Mob | Tile,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dmgOrX: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDirOrY: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dmg?: number
  ) {
    if (mobOrTile instanceof Mob) {
      const attackDir = this.dir ^ 1;
      this.doHurt(level, dmgOrX, attackDir);
    } else {
      const attackDir = this.dir ^ 1;
      this.doHurt(level, dmg!, attackDir);
    }
  }

  protected doHurt(level: Level, damage: number, attackDir: Direction) {
    if (this.hurtTime > 0) return;

    if (level.player) {
      const xd = level.player.position.x - this.position.x;
      const yd = level.player.position.y - this.position.y;
      if (xd * xd + yd * yd < 80 * 80) {
        Sound.monsterhurt.play();
      }
    }
    level.add(
      new TextParticle(
        '' + damage,
        this.position.x,
        this.position.y,
        PALETTE.get(-1, 500, 500, 500)
      )
    );
    this.health -= damage;
    if (attackDir === Direction.South) this.yKnockback = +6;
    if (attackDir === Direction.North) this.yKnockback = -6;
    if (attackDir === Direction.West) this.xKnockback = -6;
    if (attackDir === Direction.East) this.xKnockback = +6;
    this.hurtTime = 10;
  }

  update(time: GameTime, level: Level): void {
    const restoreDir = this.xKnockback !== 0 || this.yKnockback !== 0;
    const dir = this.dir;

    const knockbackDelta = time.deltaTime / 32;

    if (this.xKnockback < 0) {
      this.moveBy(level, -knockbackDelta, 0);
      this.xKnockback += knockbackDelta;
      if (this.xKnockback > 0) this.xKnockback = 0;
    }
    if (this.xKnockback > 0) {
      this.moveBy(level, knockbackDelta, 0);
      this.xKnockback -= knockbackDelta;
      if (this.xKnockback < 0) this.xKnockback = 0;
    }
    if (this.yKnockback < 0) {
      this.moveBy(level, 0, -knockbackDelta);
      this.yKnockback += knockbackDelta;
      if (this.yKnockback > 0) this.yKnockback = 0;
    }
    if (this.yKnockback > 0) {
      this.moveBy(level, 0, knockbackDelta);
      this.yKnockback -= knockbackDelta;
      if (this.yKnockback < 0) this.yKnockback = 0;
    }

    super.update(time, level);

    if (restoreDir) {
      // console.log('restore', dir, this.dir);
      this.dir = dir;
    }

    // TODO: This should be handled by the lava tile's steppedOn event.
    // if (level.getTile(x >> 4, y >> 4) == Tile.lava) {
    //   hurt(this, 4, dir ^ 1);
    // }

    // TODO: Enable this when death is working.
    // if (this.health <= 0) {
    //   this.die();
    // }

    if (this.hurtTime > 0) this.hurtTime -= time.deltaTime;
  }
}
