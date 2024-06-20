import Player from '../entities/Player';
import Item from '../items/Item';
import {TileSet} from '../system/display';
import {Keys} from '../system/input';
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
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case Keys.Enter:
        this.player.activeItem = this.selectedItem as Item;
        this.player.inventory.remove(this.player.activeItem);
        break;
    }

    super.onKeyUp(e);
  }
}
