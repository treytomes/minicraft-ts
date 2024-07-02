import {Direction} from '../../Direction';
import Inventory from '../../Inventory';
import {PALETTE} from '../../system/display';
import Player from '../Player';
import Furniture from './Furniture';

export default class Chest extends Furniture {
  inventory = new Inventory();

  constructor() {
    super('Chest');
    this.col = PALETTE.get(-1, 110, 331, 552);
    this.icon = 1;
  }

  // TODO: Implement Chest.onUsed.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUsed(player: Player, attackDir: Direction): boolean {
    // player.game.setMenu(new ContainerMenu(player, 'Chest', inventory));
    return true;
  }
}
