import {Camera} from '../Camera';
import Level from '../Level';
import ToolType from '../ToolType';
import AirWizard from '../entities/AirWizard';
import Entity from '../entities/Entity';
import Player from '../entities/Player';
import Item from '../items/Item';
import ToolItem from '../items/ToolItem';
import {PALETTE, TileSet} from '../system/display';
import {Tile} from './Tile';

export default class CloudCactusTile extends Tile {
  constructor() {
    super(PALETTE.get(505)[0]);
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const colors = PALETTE.get(444, 111, 333, 555);

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    tileset.render({pnt: topLeft, tileIndex: 17 + 1 * 32, colors});
    tileset.render({pnt: topRight, tileIndex: 18 + 1 * 32, colors});
    tileset.render({pnt: bottomLeft, tileIndex: 17 + 2 * 32, colors});
    tileset.render({pnt: bottomRight, tileIndex: 18 + 2 * 32, colors});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    if (e instanceof AirWizard) return true;
    return false;
  }

  interact(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    item: Item,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: number
  ): boolean {
    if (item instanceof ToolItem) {
      const tool = item as ToolItem;
      if (tool.type === ToolType.pickaxe) {
        if (player.payStamina(6 - tool.level)) {
          this.hurtTile(level, xt, yt, 1);
          return true;
        }
      }
    }
    return false;
  }

  // TODO: Finish implementing CloudCactusTile.hurtTile.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hurtTile(level: Level, x: number, y: number, dmg: number) {
    // const damage = level.getData(x, y) + 1;
    // level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    // level.add(new TextParticle("" + dmg, x * 16 + 8, y * 16 + 8, PALETTE.get(-1, 500, 500, 500)));
    // if (dmg > 0) {
    // 	if (damage >= 10) {
    // 		level.setTile(x, y, Tiles.cloud, 0);
    // 	} else {
    // 		level.setData(x, y, damage);
    // 	}
    // }
  }

  bumpedInto(level: Level, x: number, y: number, entity: Entity) {
    if (entity instanceof AirWizard) return;
    entity.hurt(level, this, x, y, 3);
  }
}
