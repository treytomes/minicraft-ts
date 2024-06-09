import {Camera} from '../Camera';
import Level from '../Level';
import Random from '../Random';
import ToolType from '../ToolType';
import Entity from '../entities/Entity';
import Player from '../entities/Player';
import Item from '../items/Item';
import ToolItem from '../items/ToolItem';
import {PALETTE, TileSet} from '../system/display';
import {Tile, Tiles} from './Tile';

export default class FarmTile extends Tile {
  constructor() {
    super(PALETTE.get(211)[0]);
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const colors = PALETTE.get(
      level.dirtColor - 121,
      level.dirtColor - 11,
      level.dirtColor,
      level.dirtColor + 111
    );

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    tileset.render({pnt: topLeft, tileIndex: 2 + 32, colors});
    tileset.render({pnt: topRight, tileIndex: 2 + 32, colors});
    tileset.render({pnt: bottomLeft, tileIndex: 2 + 32, colors});
    tileset.render({pnt: bottomRight, tileIndex: 2 + 32, colors});
  }

  interact(
    level: Level,
    xt: number,
    yt: number,
    player: Player,
    item: Item,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: number
  ): boolean {
    if (item instanceof ToolItem) {
      const tool = item as ToolItem;
      if (tool.type === ToolType.shovel) {
        if (player.payStamina(4 - tool.level)) {
          level.setTile(xt, yt, Tiles.dirt, 0);
          return true;
        }
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(level: Level, xt: number, yt: number) {
    const age = level.getData(xt, yt);
    if (age < 5) {
      level.setData(xt, yt, age + 1);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  steppedOn(level: Level, xt: number, yt: number, entity: Entity) {
    if (Random.nextInt(60) !== 0) return;
    if (level.getData(xt, yt) < 5) return;
    level.setTile(xt, yt, Tiles.dirt, 0);
  }
}
