import Level from '../Level';
import {Tile} from './Tile';
import * as tiles from '../tiles';
import {Color, PALETTE, TileSet} from '../system/display';
import {Camera} from '../Camera';
import Random from '../Random';
import Item from '../items/Item';
import Player from '../entities/Player';
import ToolItem from '../items/ToolItem';

export class GrassTile extends Tile {
  constructor() {
    super(new Color(0x20, 0x80, 0x20));
    this.connectsToGrass = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(
      level.grassColor,
      level.grassColor,
      level.grassColor + 111,
      level.grassColor + 111
    );
    const transitionColor = PALETTE.get(
      level.grassColor - 111,
      level.grassColor,
      level.grassColor + 111,
      level.dirtColor
    );

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = !level.getTile(tx, ty - 1).connectsToGrass;
    const d = !level.getTile(tx, ty + 1).connectsToGrass;
    const l = !level.getTile(tx - 1, ty).connectsToGrass;
    const r = !level.getTile(tx + 1, ty).connectsToGrass;

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    if (!u && !l) {
      tileset.render(0, topLeft, col, 0);
    } else
      tileset.render(
        (l ? 11 : 12) + (u ? 0 : 1) * 32,
        topLeft,
        transitionColor,
        0
      );

    if (!u && !r) {
      tileset.render(1, topRight, col, 0);
    } else
      tileset.render(
        (r ? 13 : 12) + (u ? 0 : 1) * 32,
        topRight,
        transitionColor,
        0
      );

    if (!d && !l) {
      tileset.render(2, bottomLeft, col, 0);
    } else
      tileset.render(
        (l ? 11 : 12) + (d ? 2 : 1) * 32,
        bottomLeft,
        transitionColor,
        0
      );
    if (!d && !r) {
      tileset.render(3, bottomRight, col, 0);
    } else
      tileset.render(
        (r ? 13 : 12) + (d ? 2 : 1) * 32,
        bottomRight,
        transitionColor,
        0
      );
  }

  tick(level: Level, xt: number, yt: number) {
    if (Random.nextInt(40) !== 0) return;

    let xn = xt;
    let yn = yt;

    if (Random.nextBoolean()) {
      xn += Random.nextInt(2) * 2 - 1;
    } else {
      yn += Random.nextInt(2) * 2 - 1;
    }

    if (level.getTile(xn, yn).equals(tiles.dirt)) {
      level.setTile(xn, yn, this, 0);
    }
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
  ) {
    if (item instanceof ToolItem) {
      // TODO: Finish implementing grass interaction logic.
      // const tool = item as ToolItem;
      // if (tool.type === ToolType.shovel) {
      //   if (player.payStamina(4 - tool.level)) {
      //     level.setTile(xt, yt, tiles.dirt, 0);
      //     Sound.monsterHurt.play();
      //     if (Random.nextInt(5) === 0) {
      //       level.add(
      //         new ItemEntity(
      //           new ResourceItem(Resource.seeds),
      //           xt * 16 + Random.nextInt(10) + 3,
      //           yt * 16 + Random.nextInt(10) + 3
      //         )
      //       );
      //       return true;
      //     }
      //   }
      // }
      // if (tool.type === ToolType.hoe) {
      //   if (player.payStamina(4 - tool.level)) {
      //     Sound.monsterHurt.play();
      //     if (Random.nextInt(5) === 0) {
      //       level.add(
      //         new ItemEntity(
      //           new ResourceItem(Resource.seeds),
      //           xt * 16 + Random.nextInt(10) + 3,
      //           yt * 16 + Random.nextInt(10) + 3
      //         )
      //       );
      //       return true;
      //     }
      //     level.setTile(xt, yt, tiles.farmland, 0);
      //     return true;
      //   }
      // }
    }
    return false;
  }
}
