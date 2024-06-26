import {Direction} from '../Direction';
import Level from '../Level';
import Player from '../entities/Player';
import {Resource} from '../resources';
import {Color, Font, PALETTE, TileSet} from '../system/display';
import {Tile} from '../tiles';
import Item from './Item';

export default class ResourceItem extends Item {
  resource: Resource;
  count = 1;
  font!: Font;

  get color(): Color[] {
    return this.resource.color;
  }

  get icon(): number {
    return this.resource.icon;
  }

  get name(): string {
    return this.resource.name;
  }

  get isDepleted(): boolean {
    return this.count <= 0;
  }

  constructor(resource: Resource, count = 1) {
    super();
    this.resource = resource;
    this.count = count;

    window.resources.load(Font, 'font.json').then(font => (this.font = font));
  }

  renderIcon(tileset: TileSet, x: number, y: number) {
    tileset.render({
      x,
      y,
      tileIndex: this.resource.icon,
      colors: this.resource.color,
      bits: 0,
    });
  }

  // TODO: I don't like renderInventory living in the item definition.
  renderInventory(tileset: TileSet, x: number, y: number) {
    tileset.render({
      x,
      y,
      tileIndex: this.resource.icon,
      colors: this.resource.color,
      bits: 0,
    });
    this.font?.render(
      this.resource.name,
      x + 32,
      y,
      PALETTE.get(-1, 555, 555, 555)
    );
    let cc = this.count;
    if (cc > 999) cc = 999;
    this.font?.render(cc.toString(), x + 8, y, PALETTE.get(-1, 444, 444, 444));
  }

  interactOn(
    tile: Tile,
    level: Level,
    xt: number,
    yt: number,
    player: Player,
    attackDir: Direction
  ): boolean {
    if (this.resource.interactOn(tile, level, xt, yt, player, attackDir)) {
      this.count--;
      return true;
    }
    return false;
  }
}
