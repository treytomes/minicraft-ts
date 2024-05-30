import Entity from './Entity';

// TODO: Finish implementing player.
export default class Player extends Entity {
  maxStamina = 10;
  stamina = this.maxStamina;

  payStamina(cost: number): boolean {
    if (cost > this.stamina) return false;
    this.stamina -= cost;
    return true;
  }
}
