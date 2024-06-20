import Player from '../entities/Player';
import Item from '../items/Item';
import {GameTime} from '../system/GameTime';
import {TileSet} from '../system/display';
import {Rectangle} from '../system/math';
import {UIElement} from '../system/ui';
import Menu from './Menu';

export default class InventoryMenu extends Menu {
  private player: Player;

  constructor(player: Player, tileset: TileSet, parent?: UIElement) {
    super(
      player.inventory.items,
      tileset,
      'Inventory',
      new Rectangle(1 * 8, 1 * 8, 16 * 8, 24 * 8),
      parent
    );

    this.player = player;

    if (player.activeItem) {
      this.addItem(player.activeItem);
      player.inventory.add(player.activeItem, 0);
      player.activeItem = undefined;
    }

    this.acquireKeyboardFocus();
  }

  onChooseItem() {
    this.player.activeItem = this.selectedItem as Item;
    this.player.inventory.remove(this.player.activeItem);
    this.close();
  }

  update(time: GameTime): void {
    super.update(time);

    if (this.input.attack.clicked) {
      this.onChooseItem();
    }
    if (this.input.menu.clicked) {
      this.close();
    }
  }
}
