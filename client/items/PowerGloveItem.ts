import Entity from '../entities/Entity';
import Furniture from '../entities/furniture/Furniture';
import Player from '../entities/Player';
import {Color, Font, PALETTE, TileSet} from '../system/display';
import Item from './Item';

export default class PowerGloveItem extends Item {
  get color(): Color[] {
    return PALETTE.get(-1, 100, 320, 430);
  }

  get icon(): number {
    return 7 + 4 * 32;
  }

  get name(): string {
    return 'Pow glove';
  }

  renderIcon(tileset: TileSet, x: number, y: number) {
    tileset.render({x, y, tileIndex: this.icon, colors: this.color});
  }

  renderInventory(tileset: TileSet, x: number, y: number) {
    const font = new Font(tileset);
    tileset.render({x, y, tileIndex: this.icon, colors: this.color});
    font.render(this.name, x + 8, y, PALETTE.get(-1, 555, 555, 555));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interact(player: Player, entity: Entity, attackDir: number): boolean {
    if (entity instanceof Furniture) {
      const f = entity as Furniture;
      f.take(player);
      return true;
    }
    return false;
  }
}
