import {Camera} from '../Camera';
import Level from '../Level';
import ToolType from '../ToolType';
import Entity from '../entities/Entity';
import ItemEntity from '../entities/ItemEntity';
import Player from '../entities/Player';
import Item from '../items/Item';
import ResourceItem from '../items/ResourceItem';
import ToolItem from '../items/ToolItem';
import {Resources} from '../resources/Resource';
import {PALETTE, TileSet} from '../system/display';
import Random from '../system/math/Random';
import {Tile, Tiles} from './Tile';

export default class CloudTile extends Tile {
  constructor() {
    super(PALETTE.get(333)[0]);
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(444, 444, 555, 555);
    const transitionColor = PALETTE.get(333, 444, 555, -1);

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = level.getTile(tx, ty - 1).equals(Tiles.infiniteFall);
    const d = level.getTile(tx, ty + 1).equals(Tiles.infiniteFall);
    const l = level.getTile(tx - 1, ty).equals(Tiles.infiniteFall);
    const r = level.getTile(tx + 1, ty).equals(Tiles.infiniteFall);

    const ul = level.getTile(tx - 1, ty - 1).equals(Tiles.infiniteFall);
    const dl = level.getTile(tx - 1, ty + 1).equals(Tiles.infiniteFall);
    const ur = level.getTile(tx + 1, ty - 1).equals(Tiles.infiniteFall);
    const dr = level.getTile(tx + 1, ty + 1).equals(Tiles.infiniteFall);

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    if (!u && !l) {
      if (!ul) {
        tileset.render({pnt: topLeft, tileIndex: 17, colors: col, bits: 0});
      } else {
        tileset.render({
          pnt: topLeft,
          tileIndex: 7 + 0 * 32,
          colors: transitionColor,
          bits: 3,
        });
      }
    } else {
      tileset.render({
        pnt: topLeft,
        tileIndex: (l ? 6 : 5) + (u ? 2 : 1) * 32,
        colors: transitionColor,
        bits: 3,
      });
    }

    if (!u && !r) {
      if (!ur) {
        tileset.render({pnt: topRight, tileIndex: 18, colors: col, bits: 0});
      } else {
        tileset.render({
          pnt: topRight,
          tileIndex: 8 + 0 * 32,
          colors: transitionColor,
          bits: 3,
        });
      }
    } else {
      tileset.render({
        pnt: topRight,
        tileIndex: (r ? 4 : 5) + (u ? 2 : 1) * 32,
        colors: transitionColor,
        bits: 3,
      });
    }

    if (!d && !l) {
      if (!dl) {
        tileset.render({pnt: bottomLeft, tileIndex: 20, colors: col, bits: 0});
      } else {
        tileset.render({
          pnt: bottomLeft,
          tileIndex: 7 + 1 * 32,
          colors: transitionColor,
          bits: 3,
        });
      }
    } else {
      tileset.render({
        pnt: bottomLeft,
        tileIndex: (l ? 6 : 5) + (d ? 0 : 1) * 32,
        colors: transitionColor,
        bits: 3,
      });
    }

    if (!d && !r) {
      if (!dr) {
        tileset.render({pnt: bottomRight, tileIndex: 19, colors: col, bits: 0});
      } else {
        tileset.render({
          pnt: bottomRight,
          tileIndex: 8 + 1 * 32,
          colors: transitionColor,
          bits: 3,
        });
      }
    } else {
      tileset.render({
        pnt: bottomRight,
        tileIndex: (r ? 4 : 5) + (d ? 0 : 1) * 32,
        colors: transitionColor,
        bits: 3,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    return true;
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
        if (player.payStamina(5)) {
          level.setTile(xt, yt, Tiles.infiniteFall, 0);
          const count = Random.nextInt(2) + 1;
          for (let i = 0; i < count; i++) {
            level.add(
              new ItemEntity(
                new ResourceItem(Resources.cloud),
                xt * 16 + Random.nextInt(10) + 3,
                yt * 16 + Random.nextInt(10) + 3
              )
            );
          }
          return true;
        }
      }
    }
    return false;
  }
}
