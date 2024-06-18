import {Camera} from '../Camera';
import Level from '../Level';
import ToolType from '../ToolType';
import Entity from '../entities/Entity';
import ItemEntity from '../entities/ItemEntity';
import Mob from '../entities/Mob';
import Player from '../entities/Player';
import Item from '../items/Item';
import ResourceItem from '../items/ResourceItem';
import ToolItem from '../items/ToolItem';
import {Resources} from '../resources/Resource';
import {GameTime} from '../system/GameTime';
import {PALETTE, TileSet} from '../system/display';
import Random from '../system/math/Random';
import {Tile, Tiles} from './Tile';

export default class SandTile extends Tile {
  constructor() {
    super(PALETTE.get(441)[0]);
    this.connectsToSand = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(
      level.sandColor + 2,
      level.sandColor,
      level.sandColor - 110,
      level.sandColor - 110
    );
    const transitionColor = PALETTE.get(
      level.sandColor - 110,
      level.sandColor,
      level.sandColor - 110,
      level.dirtColor
    );

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = !level.getTile(tx, ty - 1).connectsToSand;
    const d = !level.getTile(tx, ty + 1).connectsToSand;
    const l = !level.getTile(tx - 1, ty).connectsToSand;
    const r = !level.getTile(tx + 1, ty).connectsToSand;

    const steppedOn = level.getData(x, y) > 0;

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    if (!u && !l) {
      if (!steppedOn) {
        tileset.render({
          pnt: topLeft,
          tileIndex: 0,
          colors: col,
          bits: 0,
        });
      } else {
        tileset.render({
          pnt: topLeft,
          tileIndex: 3 + 1 * 32,
          colors: col,
          bits: 0,
        });
      }
    } else {
      tileset.render({
        pnt: topLeft,
        tileIndex: (l ? 11 : 12) + (u ? 0 : 1) * 32,
        colors: transitionColor,
        bits: 0,
      });
    }

    if (!u && !r) {
      tileset.render({
        pnt: topRight,
        tileIndex: 1,
        colors: col,
        bits: 0,
      });
    } else {
      tileset.render({
        pnt: topRight,
        tileIndex: (r ? 13 : 12) + (u ? 0 : 1) * 32,
        colors: transitionColor,
        bits: 0,
      });
    }

    if (!d && !l) {
      tileset.render({
        pnt: bottomLeft,
        tileIndex: 2,
        colors: col,
        bits: 0,
      });
    } else {
      tileset.render({
        pnt: bottomLeft,
        tileIndex: (l ? 11 : 12) + (d ? 2 : 1) * 32,
        colors: transitionColor,
        bits: 0,
      });
    }

    if (!d && !r) {
      if (!steppedOn) {
        tileset.render({
          pnt: bottomRight,
          tileIndex: 3,
          colors: col,
          bits: 0,
        });
      } else {
        tileset.render({
          pnt: bottomRight,
          tileIndex: 3 + 1 * 32,
          colors: col,
          bits: 0,
        });
      }
    } else {
      tileset.render({
        pnt: bottomRight,
        tileIndex: (r ? 13 : 12) + (d ? 2 : 1) * 32,
        colors: transitionColor,
        bits: 0,
      });
    }
  }

  tick(time: GameTime, level: Level, xt: number, yt: number) {
    const d = level.getData(xt, yt);
    if (d > 0) level.setData(xt, yt, d - time.deltaTime / 32);
  }

  steppedOn(level: Level, x: number, y: number, entity: Entity) {
    if (entity instanceof Mob) {
      level.setData(x, y, 10);
    }
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
          level.add(
            new ItemEntity(
              new ResourceItem(Resources.sand),
              xt * 16 + Random.nextInt(10) + 3,
              yt * 16 + Random.nextInt(10) + 3
            )
          );
          return true;
        }
      }
    }
    return false;
  }
}
