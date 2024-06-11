import {Camera} from '../Camera';
import Level from '../Level';
import Random from '../Random';
import ToolType from '../ToolType';
import Entity from '../entities/Entity';
import Player from '../entities/Player';
import Item from '../items/Item';
import ToolItem from '../items/ToolItem';
import {PALETTE, TileSet} from '../system/display';
import {Tile} from './Tile';

export default class HardRockTile extends Tile {
  constructor() {
    super(PALETTE.get(222)[0]);
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(334, 334, 223, 223);
    const transitionColor = PALETTE.get(1, 334, 445, level.dirtColor);

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
        tileset.render({tileIndex: 0, pnt: topLeft, colors: col, bits: 0});
      } else {
        tileset.render({
          tileIndex: 7 + 0 * 32,
          pnt: topLeft,
          colors: transitionColor,
          bits: 3,
        });
      }
    } else {
      tileset.render({
        tileIndex: (l ? 6 : 5) + (u ? 2 : 1) * 32,
        pnt: topLeft,
        colors: transitionColor,
        bits: 3,
      });
    }

    if (!u && !r) {
      if (!ur) {
        tileset.render({tileIndex: 1, pnt: topRight, colors: col, bits: 0});
      } else {
        tileset.render({
          tileIndex: 8 + 0 * 32,
          pnt: topRight,
          colors: transitionColor,
          bits: 3,
        });
      }
    } else {
      tileset.render({
        tileIndex: (r ? 4 : 5) + (u ? 2 : 1) * 32,
        pnt: topRight,
        colors: transitionColor,
        bits: 3,
      });
    }

    if (!d && !l) {
      if (!dl)
        tileset.render({tileIndex: 2, pnt: bottomLeft, colors: col, bits: 0});
      else
        tileset.render({
          tileIndex: 7 + 1 * 32,
          pnt: bottomLeft,
          colors: transitionColor,
          bits: 3,
        });
    } else
      tileset.render({
        tileIndex: (l ? 6 : 5) + (d ? 0 : 1) * 32,
        pnt: bottomLeft,
        colors: transitionColor,
        bits: 3,
      });

    if (!d && !r) {
      if (!dr) {
        tileset.render({tileIndex: 3, pnt: bottomRight, colors: col, bits: 0});
      } else {
        tileset.render({
          tileIndex: 8 + 1 * 32,
          pnt: bottomRight,
          colors: transitionColor,
          bits: 3,
        });
      }
    } else {
      tileset.render({
        tileIndex: (r ? 4 : 5) + (d ? 0 : 1) * 32,
        pnt: bottomRight,
        colors: transitionColor,
        bits: 3,
      });
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
      if (tool.type === ToolType.pickaxe && tool.level === 4) {
        if (player.payStamina(4 - tool.level)) {
          this.hurt(level, xt, yt, Random.nextInt(10) + tool.level * 5 + 10);
          return true;
        }
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hurtTile(level: Level, x: number, y: number, dmg: number) {
    // TODO: Finish implementing HardRockTile.hurt.
    // int damage = level.getData(x, y) + dmg;
    // level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    // level.add(new TextParticle("" + dmg, x * 16 + 8, y * 16 + 8, Color.get(-1, 500, 500, 500)));
    // if (damage >= 200) {
    // 	int count = random.nextInt(4) + 1;
    // 	for (int i = 0; i < count; i++) {
    // 		level.add(new ItemEntity(new ResourceItem(Resource.stone), x * 16 + random.nextInt(10) + 3, y * 16 + random.nextInt(10) + 3));
    // 	}
    // 	count = random.nextInt(2);
    // 	for (int i = 0; i < count; i++) {
    // 		level.add(new ItemEntity(new ResourceItem(Resource.coal), x * 16 + random.nextInt(10) + 3, y * 16 + random.nextInt(10) + 3));
    // 	}
    // 	level.setTile(x, y, Tile.dirt, 0);
    // } else {
    // 	level.setData(x, y, damage);
    // }
  }

  tick(level: Level, xt: number, yt: number) {
    const damage = level.getData(xt, yt);
    if (damage > 0) level.setData(xt, yt, damage - 1);
  }
}
