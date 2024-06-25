import Level from '../Level';
import Furniture from '../entities/furniture/Furniture';
import Player from '../entities/Player';
import {Color, Font, PALETTE, TileSet} from '../system/display';
import {Tile} from '../tiles';
import Item from './Item';
import {Direction} from '../Direction';

export default class FurnitureItem extends Item {
  furniture: Furniture;
  placed = false;

  get color(): Color[] {
    return this.furniture.col;
  }

  get icon() {
    return this.furniture.icon + 10 * 32;
  }

  constructor(furniture: Furniture) {
    super();
    this.furniture = furniture;
  }

  get isDepleted() {
    return this.placed;
  }

  get name() {
    return this.furniture.name;
  }

  renderIcon(tileset: TileSet, x: number, y: number) {
    tileset.render({x, y, tileIndex: this.icon, colors: this.color});
  }

  // TODO: Should font and tileset be globally provided values?  This just screams "Dependency Injection".
  renderInventory(tileset: TileSet, x: number, y: number) {
    const font = new Font(tileset);
    tileset.render({x, y, tileIndex: this.icon, colors: this.color});
    font.render(this.furniture.name, x + 8, y, PALETTE.get(-1, 555, 555, 555));
  }

  interactOn(
    tile: Tile,
    level: Level,
    xt: number,
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: Direction
  ): boolean {
    if (tile.mayPass(level, xt, yt, this.furniture)) {
      this.furniture.moveTo(xt * 16 + 8, yt * 16 + 8);
      level.add(this.furniture);
      this.placed = true;
      return true;
    }
    return false;
  }
}
