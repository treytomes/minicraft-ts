import {Direction} from '../../Direction';
import {PALETTE} from '../../system/display';
import {Point} from '../../system/math';
import Player from '../Player';
import Furniture from './Furniture';

export default class Oven extends Furniture {
  constructor() {
    super('Oven');
    this.col = PALETTE.get(-1, 0, 332, 442);
    this.icon = 2;
    this.size = new Point(6, 4);
  }

  // TODO: Implement Oven.use.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(player: Player, attackDir: Direction): boolean {
    // player.game.setMenu(new CraftingMenu(Crafting.ovenRecipes, player));
    return true;
  }
}
