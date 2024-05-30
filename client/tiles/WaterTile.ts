import Level from '../Level';
import {Tile} from './Tile';
import {Color, PALETTE, TileSet} from '../system/display';
import Random from '../Random';

export class WaterTile extends Tile {
  constructor() {
    super(new Color(0, 0, 0x80));
    this.connectsToSand = true;
    this.connectsToWater = true;
  }

  render(
    tileset: TileSet,
    level: Level,
    x: number,
    y: number,
    offsetX: number,
    offsetY: number
  ) {
    const col: Color[] = PALETTE.get(5, 5, 115, 115);
    const transitionColor1: Color[] = PALETTE.get(
      3,
      5,
      level.dirtColor - 111,
      level.dirtColor
    );
    const transitionColor2: Color[] = PALETTE.get(
      3,
      5,
      level.sandColor - 110,
      level.sandColor
    );

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = !level.getTile(tx, ty - 1).connectsToWater;
    const d = !level.getTile(tx, ty + 1).connectsToWater;
    const l = !level.getTile(tx - 1, ty).connectsToWater;
    const r = !level.getTile(tx + 1, ty).connectsToWater;

    const su: boolean = u && level.getTile(tx, ty - 1).connectsToSand;
    const sd: boolean = d && level.getTile(tx, ty + 1).connectsToSand;
    const sl: boolean = l && level.getTile(tx - 1, ty).connectsToSand;
    const sr: boolean = r && level.getTile(tx + 1, ty).connectsToSand;

    if (!u && !l) {
      tileset.render(
        (Tile.tickCount + 1) % 4, // Random.nextInt(4),
        offsetX + x + 0,
        offsetY + y + 0,
        col,
        (Tile.tickCount - 2) % 4 // Random.nextInt(4)
      );
    } else {
      tileset.render(
        (l ? 14 : 15) + (u ? 0 : 1) * tileset.tilesPerRow,
        offsetX + x + 0,
        offsetY + y + 0,
        su || sl ? transitionColor2 : transitionColor1,
        0
      );
    }

    if (!u && !r) {
      tileset.render(
        (Tile.tickCount + 3) % 4, // Random.nextInt(4),
        offsetX + x + tileset.tileWidth,
        offsetY + y + 0,
        col,
        (Tile.tickCount - 4) % 4 // Random.nextInt(4)
      );
    } else {
      tileset.render(
        (r ? 16 : 15) + (u ? 0 : 1) * tileset.tilesPerRow,
        offsetX + x + tileset.tileWidth,
        offsetY + y + 0,
        su || sr ? transitionColor2 : transitionColor1,
        0
      );
    }

    if (!d && !l) {
      tileset.render(
        (Tile.tickCount + 5) % 4, // Random.nextInt(4),
        offsetX + x + 0,
        offsetY + y + tileset.tileHeight,
        col,
        (Tile.tickCount - 6) % 4 // Random.nextInt(4)
      );
    } else {
      tileset.render(
        (l ? 14 : 15) + (d ? 2 : 1) * tileset.tilesPerRow,
        offsetX + x + 0,
        offsetY + y + tileset.tileHeight,
        sd || sl ? transitionColor2 : transitionColor1,
        0
      );
    }
    if (!d && !r) {
      tileset.render(
        (Tile.tickCount + 7) % 4, // Random.nextInt(4),
        offsetX + x + tileset.tileWidth,
        offsetY + y + tileset.tileHeight,
        col,
        (Tile.tickCount - 8) % 4 // Random.nextInt(4)
      );
    } else {
      tileset.render(
        (r ? 16 : 15) + (d ? 2 : 1) * tileset.tilesPerRow,
        offsetX + x + tileset.tileWidth,
        offsetY + y + tileset.tileHeight,
        sd || sr ? transitionColor2 : transitionColor1,
        0
      );
    }
  }

  // TODO: Implement WaterTile.mayPass and tick.
  // mayPass(level: Level, x: number, y: number, e: Entity) {
  //   return e.canSwim();
  // }

  // tick(level: Level, xt: number, yt: number) {
  //   let xn = xt;
  //   let yn = yt;

  //   if (Random.nextBoolean()) {
  //     xn += Random.nextInt(2) * 2 - 1;
  //   } else {
  //     yn += Random.nextInt(2) * 2 - 1;
  //   }

  //   if (level.getTile(xn, yn) === tiles.hole) {
  //     level.setTile(xn, yn, this, 0);
  //   }
  // }
}