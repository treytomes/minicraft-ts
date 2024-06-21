import {Direction} from '../../Direction';
import {PALETTE} from '../../system/display';
import {Point} from '../../system/math';
import Player from '../Player';
import Furniture from './Furniture';

export default class Furnace extends Furniture {
  constructor() {
    super('Furnace');
    this.col = PALETTE.get(-1, 0, 222, 333);
    this.icon = 3;
    this.size = new Point(6, 4);
  }

  // TODO: Implement Furnace.onUsed.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUsed(player: Player, attackDir: Direction): boolean {
    // player.game.setMenu(new CraftingMenu(Crafting.furnaceRecipes, player));
    return true;
  }
}
