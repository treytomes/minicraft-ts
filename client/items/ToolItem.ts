import Entity from '../entities/Entity';
import Random from '../system/math/Random';
import ToolType from '../ToolType';
import Item from './Item';
import {Font, PALETTE, TileSet} from '../system/display';

export default class ToolItem extends Item {
  static readonly MAX_LEVEL = 5;
  static readonly LEVEL_NAMES = ['Wood', 'Rock', 'Iron', 'Gold', 'Gem'];

  static readonly LEVEL_COLORS = [
    PALETTE.get(-1, 100, 321, 431),
    PALETTE.get(-1, 100, 321, 111),
    PALETTE.get(-1, 100, 321, 555),
    PALETTE.get(-1, 100, 321, 550),
    PALETTE.get(-1, 100, 321, 55),
  ];

  type: ToolType;
  level = 0;

  constructor(type: ToolType, level: number) {
    super();
    this.type = type;
    this.level = level;
  }

  get color() {
    return ToolItem.LEVEL_COLORS[this.level];
  }

  get icon() {
    return this.type.sprite + 5 * 32;
  }

  get canAttack() {
    return true;
  }

  get name() {
    return ToolItem.LEVEL_NAMES[this.level] + ' ' + this.type.name;
  }

  renderIcon(tileset: TileSet, x: number, y: number) {
    tileset.render({tileIndex: this.icon, x, y, colors: this.color});
  }

  renderInventory(tileset: TileSet, font: Font, x: number, y: number) {
    tileset.render({tileIndex: this.icon, x, y, colors: this.color});
    font.render(this.name, x + 8, y, PALETTE.get(-1, 555, 555, 555));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAttackDamageBonus(e: Entity): number {
    if (this.type === ToolType.axe) {
      return (this.level + 1) * 2 + Random.nextInt(4);
    }
    if (this.type === ToolType.sword) {
      return (
        (this.level + 1) * 3 + Random.nextInt(2 + this.level * this.level * 2)
      );
    }
    return 1;
  }

  public matches(item: Item): boolean {
    if (item instanceof ToolItem) {
      const other = item as ToolItem;
      if (other.type !== this.type) return false;
      if (other.level !== this.level) return false;
      return true;
    }
    return false;
  }
}
