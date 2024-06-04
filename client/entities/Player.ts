import Mob from './Mob';

// TODO: Finish implementing player.
export default class Player extends Mob {
  maxStamina = 10;
  stamina = this.maxStamina;

  payStamina(cost: number): boolean {
    if (cost > this.stamina) return false;
    this.stamina -= cost;
    return true;
  }
}
