import {Tile} from './Tile';
import {PALETTE, TileSet} from '../system/display';
import {Camera} from '../Camera';
import Entity from '../entities/Entity';
import Player from '../entities/Player';
import Item from '../items/Item';
import ToolItem from '../items/ToolItem';
import ToolType from '../ToolType';
import Random from '../Random';
import Level from '../Level';

export class TreeTile extends Tile {
  constructor() {
    super(PALETTE.get(10)[0]);
    this.connectsToGrass = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(10, 30, 151, level.grassColor);
    const barkCol1 = PALETTE.get(10, 30, 430, level.grassColor);
    const barkCol2 = PALETTE.get(10, 30, 320, level.grassColor);

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = level.getTile(tx, ty - 1).equals(this);
    const d = level.getTile(tx, ty + 1).equals(this);
    const l = level.getTile(tx - 1, ty).equals(this);
    const r = level.getTile(tx + 1, ty).equals(this);

    const ul = level.getTile(tx - 1, ty - 1).equals(this);
    const dl = level.getTile(tx - 1, ty + 1).equals(this);
    const ur = level.getTile(tx + 1, ty - 1).equals(this);
    const dr = level.getTile(tx + 1, ty + 1).equals(this);

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    if (u && ul && l) {
      tileset.render(10 + 1 * 32, topLeft, col, 0);
    } else {
      tileset.render(9 + 0 * 32, topLeft, col, 0);
    }
    if (u && ur && r) {
      tileset.render(10 + 2 * 32, topRight, barkCol2, 0);
    } else {
      tileset.render(10 + 0 * 32, topRight, col, 0);
    }
    if (d && dl && l) {
      tileset.render(10 + 2 * 32, bottomLeft, barkCol2, 0);
    } else {
      tileset.render(9 + 1 * 32, bottomLeft, barkCol1, 0);
    }
    if (d && dr && r) {
      tileset.render(10 + 1 * 32, bottomRight, col, 0);
    } else {
      tileset.render(10 + 3 * 32, bottomRight, barkCol2, 0);
    }
  }

  tick(level: Level, xt: number, yt: number) {
    const damage = level.getData(xt, yt);
    if (damage > 0) {
      level.setData(xt, yt, damage - 1);
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
      if (tool.type === ToolType.axe) {
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
    // {
    // 	const count = Random.nextInt(10) == 0 ? 1 : 0;
    // 	for (let i = 0; i < count; i++) {
    // 		level.add(new ItemEntity(new ResourceItem(Resource.apple), x * 16 + Random.nextInt(10) + 3, y * 16 + Random.nextInt(10) + 3));
    // 	}
    // }
    // const damage = level.getData(x, y) + dmg;
    // level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    // level.add(new TextParticle("" + dmg, x * 16 + 8, y * 16 + 8, PALETTE.get(-1, 500, 500, 500)));
    // if (damage >= 20) {
    // 	const count = Random.nextInt(2) + 1;
    // 	for (let i = 0; i < count; i++) {
    // 		level.add(new ItemEntity(new ResourceItem(Resource.wood), x * 16 + Random.nextInt(10) + 3, y * 16 + Random.nextInt(10) + 3));
    // 	}
    // 	count = Random.nextInt(Random.nextInt(4) + 1);
    // 	for (let i = 0; i < count; i++) {
    // 		level.add(new ItemEntity(new ResourceItem(Resource.acorn), x * 16 + Random.nextInt(10) + 3, y * 16 + Random.nextInt(10) + 3));
    // 	}
    // 	level.setTile(x, y, tiles.grass, 0);
    // } else {
    // 	level.setData(x, y, damage);
    // }
  }
}
