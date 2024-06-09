import {PALETTE} from '../system/display';
import Entity from './Entity';

// TODO: Finish implementing Mob.
export default class Mob extends Entity {
  public maxHealth = 10;
  public health = this.maxHealth;
  public hurtTime = 0;

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
}
