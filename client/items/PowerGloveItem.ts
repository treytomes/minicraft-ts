import {Direction} from '../Direction';
import Entity from '../entities/Entity';
import Furniture from '../entities/furniture/Furniture';
import Player from '../entities/Player';
import {Color, Font, PALETTE, TileSet} from '../system/display';
import Item from './Item';

export default class PowerGloveItem extends Item {
  private font!: Font;

  get color(): Color[] {
    return PALETTE.get(-1, 100, 320, 430);
  }

  get icon(): number {
    return 7 + 4 * 32;
  }

  get name(): string {
    return 'Pow glove';
  }

  constructor() {
    super();
    window.resources.load(Font, 'font.json').then(font => (this.font = font));
  }

  renderIcon(tileset: TileSet, x: number, y: number) {
    tileset.render({x, y, tileIndex: this.icon, colors: this.color});
  }

  renderInventory(tileset: TileSet, x: number, y: number) {
    tileset.render({x, y, tileIndex: this.icon, colors: this.color});
    this.font?.render(this.name, x + 8, y, PALETTE.get(-1, 555, 555, 555));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interact(player: Player, entity: Entity, attackDir: Direction): boolean {
    if (entity instanceof Furniture) {
      const f = entity as Furniture;
      f.take(player);
      return true;
    }
    return false;
  }
}
