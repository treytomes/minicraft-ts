import {Camera} from '../Camera';
import {Direction} from '../Direction';
import Level from '../Level';
import FurnitureItem from '../items/FurnitureItem';
import PowerGloveItem from '../items/PowerGloveItem';
import {GameTime} from '../system/GameTime';
import {Color, PALETTE, TileSet} from '../system/display';
import {Point} from '../system/math';
import Entity from './Entity';
import Player from './Player';

export default class Furniture extends Entity {
  private pushTime = 0;
  private pushDir = Direction.Undefined;
  public col: Color[];
  public icon: number;
  public name: string;
  private shouldTake?: Player;

  constructor(name: string) {
    super();
    this.name = name;
    this.size = new Point(6, 6);

    // TODO: I need default values.  Are these sufficient?  Where else are these being set?
    this.col = PALETTE.get(555, 555, 555, 555);
    this.icon = 0;
  }

  update(time: GameTime, level: Level) {
    if (this.shouldTake !== undefined) {
      if (this.shouldTake.activeItem instanceof PowerGloveItem) {
        this.remove();
        this.shouldTake.inventory.add(this.shouldTake.activeItem, 0);
        this.shouldTake.activeItem = new FurnitureItem(this);
      }
      this.shouldTake = undefined;
    }
    if (this.pushDir === Direction.South) this.moveBy(level, 0, 1);
    if (this.pushDir === Direction.North) this.moveBy(level, 0, -1);
    if (this.pushDir === Direction.West) this.moveBy(level, -1, 0);
    if (this.pushDir === Direction.East) this.moveBy(level, 1, 0);
    this.pushDir = Direction.Undefined;
    if (this.pushTime > 0) this.pushTime--;
  }

  render(tileset: TileSet, camera: Camera) {
    const renderPosition = camera.translate(this.position);

    tileset.render({
      x: renderPosition.x - 8,
      y: renderPosition.y - 8 - 4,
      tileIndex: this.icon * 2 + 8 * 32,
      colors: this.col,
    });
    tileset.render({
      x: renderPosition.x - 0,
      y: renderPosition.y - 8 - 4,
      tileIndex: this.icon * 2 + 8 * 32 + 1,
      colors: this.col,
    });
    tileset.render({
      x: renderPosition.x - 8,
      y: renderPosition.y - 0 - 4,
      tileIndex: this.icon * 2 + 8 * 32 + 32,
      colors: this.col,
    });
    tileset.render({
      x: renderPosition.x - 0,
      y: renderPosition.y - 0 - 4,
      tileIndex: this.icon * 2 + 8 * 32 + 33,
      colors: this.col,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  blocks(e: Entity): boolean {
    return true;
  }

  protected touchedBy(entity: Entity) {
    if (entity instanceof Player && this.pushTime === 0) {
      this.pushDir = (entity as Player).dir;
      this.pushTime = 10;
    }
  }

  take(player: Player) {
    this.shouldTake = player;
  }
}
