import {Camera} from '../Camera';
import Level from '../Level';
import Random from '../Random';
import ToolType from '../ToolType';
import Entity from '../entities/Entity';
import Mob from '../entities/Mob';
import Player from '../entities/Player';
import Item from '../items/Item';
import ToolItem from '../items/ToolItem';
import {PALETTE, TileSet} from '../system/display';
import {Tile} from './Tile';

export default class RockTile extends Tile {
  constructor() {
    super(PALETTE.get(333)[0]);
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(444, 444, 333, 333);
    const transitionColor = PALETTE.get(111, 444, 555, level.dirtColor);

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = !level.getTile(tx, ty - 1).equals(this);
    const d = !level.getTile(tx, ty + 1).equals(this);
    const l = !level.getTile(tx - 1, ty).equals(this);
    const r = !level.getTile(tx + 1, ty).equals(this);

    const ul = !level.getTile(tx - 1, ty - 1).equals(this);
    const dl = !level.getTile(tx - 1, ty + 1).equals(this);
    const ur = !level.getTile(tx + 1, ty - 1).equals(this);
    const dr = !level.getTile(tx + 1, ty + 1).equals(this);

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    if (!u && !l) {
      if (!ul) {
        tileset.render(0, topLeft, col, 0);
      } else {
        tileset.render(7 + 0 * 32, topLeft, transitionColor, 3);
      }
    } else {
      tileset.render(
        (l ? 6 : 5) + (u ? 2 : 1) * 32,
        topLeft,
        transitionColor,
        3
      );
    }

    if (!u && !r) {
      if (!ur) {
        tileset.render(1, topRight, col, 0);
      } else {
        tileset.render(8 + 0 * 32, topRight, transitionColor, 3);
      }
    } else {
      tileset.render(
        (r ? 4 : 5) + (u ? 2 : 1) * 32,
        topRight,
        transitionColor,
        3
      );
    }

    if (!d && !l) {
      if (!dl) tileset.render(2, bottomLeft, col, 0);
      else tileset.render(7 + 1 * 32, bottomLeft, transitionColor, 3);
    } else
      tileset.render(
        (l ? 6 : 5) + (d ? 0 : 1) * 32,
        bottomLeft,
        transitionColor,
        3
      );

    if (!d && !r) {
      if (!dr) {
        tileset.render(3, bottomRight, col, 0);
      } else {
        tileset.render(8 + 1 * 32, bottomRight, transitionColor, 3);
      }
    } else {
      tileset.render(
        (r ? 4 : 5) + (d ? 0 : 1) * 32,
        bottomRight,
        transitionColor,
        3
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    return false;
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
      if (tool.type === ToolType.pickaxe) {
        if (player.payStamina(4 - tool.level)) {
          this.hurt(level, xt, yt, Random.nextInt(10) + tool.level * 5 + 10);
          return true;
        }
      }
    }
    return false;
  }

  protected hurtTile(level: Level, x: number, y: number, dmg: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const damage = level.getData(x, y) + dmg;
    // TODO: Finish implementing RockTile.hurt.
    // level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    // level.add(
    //   new TextParticle(
    //     '' + dmg,
    //     x * 16 + 8,
    //     y * 16 + 8,
    //     PALETTE.get(-1, 500, 500, 500)
    //   )
    // );
    // if (damage >= 50) {
    //   let count = Random.nextInt(4) + 1;
    //   for (let i = 0; i < count; i++) {
    //     level.add(
    //       new ItemEntity(
    //         new ResourceItem(Resource.stone),
    //         x * 16 + Random.nextInt(10) + 3,
    //         y * 16 + random.nextInt(10) + 3
    //       )
    //     );
    //   }
    //   count = Random.nextInt(2);
    //   for (let i = 0; i < count; i++) {
    //     level.add(
    //       new ItemEntity(
    //         new ResourceItem(Resource.coal),
    //         x * 16 + Random.nextInt(10) + 3,
    //         y * 16 + random.nextInt(10) + 3
    //       )
    //     );
    //   }
    //   level.setTile(x, y, tiles.dirt, 0);
    // } else {
    //   level.setData(x, y, damage);
    // }
  }

  tick(level: Level, xt: number, yt: number) {
    const damage = level.getData(xt, yt);
    if (damage > 0) level.setData(xt, yt, damage - 1);
  }
}
