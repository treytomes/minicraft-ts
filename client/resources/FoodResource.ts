import {Direction} from '../Direction';
import Level from '../Level';
import Player from '../entities/Player';
import {Color} from '../system/display';
import {Tile} from '../tiles/Tile';
import {Resource} from './Resource';

export default class FoodResource extends Resource {
  private readonly heal: number;
  private readonly staminaCost: number;

  constructor(
    name: string,
    sprite: number,
    color: Color[],
    heal: number,
    staminaCost: number
  ) {
    super(name, sprite, color);
    this.heal = heal;
    this.staminaCost = staminaCost;
  }

  interactOn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tile: Tile,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: Direction
  ): boolean {
    if (
      player.health < player.maxHealth &&
      player.payStamina(this.staminaCost)
    ) {
      player.heal(this.heal);
      return true;
    }
    return false;
  }
}
