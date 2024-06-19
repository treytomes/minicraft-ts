import {Direction} from '../../Direction';
import {PALETTE} from '../../system/display';
import {Point} from '../../system/math';
import Player from '../Player';
import Furniture from './Furniture';

export default class Workbench extends Furniture {
  constructor() {
    super('Workbench');
    this.col = PALETTE.get(-1, 100, 321, 431);
    this.icon = 4;
    this.size = new Point(6, 4);
  }

  // TODO: Implement Workbench.use.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(player: Player, attackDir: Direction): boolean {
    // player.game.setMenu(new CraftingMenu(Crafting.workbenchRecipes, player));
    return true;
  }
}
