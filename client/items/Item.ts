import Entity from '../entities/Entity';
import ItemEntity from '../entities/ItemEntity';
import Level from '../Level';
import Player from '../entities/Player';
import {Color, Font, PALETTE, TileSet} from '../system/display';
import {Tile} from '../tiles/Tile';

export default class Item {
  get color(): Color[] {
    return PALETTE.get(0, 0, 0, 0);
  }

  get icon(): number {
    return 0;
  }

  get isDepleted(): boolean {
    return false;
  }

  get canAttack(): boolean {
    return false;
  }

  get name(): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTake(itemEntity: ItemEntity) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderInventory(tileset: TileSet, font: Font, x: number, y: number) {}

  // TODO: Should attackDir be an enum?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interact(player: Player, entity: Entity, attackDir: number): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderIcon(tileset: TileSet, x: number, y: number) {}

  interactOn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tile: Tile,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: number
  ): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAttackDamageBonus(e: Entity): number {
    return 0;
  }

  public matches(item: Item): boolean {
    // TODO: Test this one explicitly.
    return typeof item === typeof this;
  }
}
