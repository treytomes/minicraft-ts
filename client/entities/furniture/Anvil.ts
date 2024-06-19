import {Direction} from '../../Direction';
import {PALETTE} from '../../system/display';
import {Point} from '../../system/math';
import Player from '../Player';
import Furniture from './Furniture';

export default class Anvil extends Furniture {
  constructor() {
    super('Anvil');
    this.col = PALETTE.get(-1, 0, 111, 222);
    this.icon = 0;
    this.size = new Point(6, 4);
  }

  // TODO: Implement Anvil.use.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(player: Player, attackDir: Direction): boolean {
    // player.game.setMenu(new CraftingMenu(Crafting.anvilRecipes, player));
    return true;
  }
}
