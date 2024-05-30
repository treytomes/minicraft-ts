import Level from '../Level';
import {Tile} from './Tile';
import * as tiles from '../tiles';
import {Color, PALETTE, TileSet} from '../system/display';
import {Camera} from '../Camera';
import Entity from '../Entity';
import Random from '../Random';

export class WaterTile extends Tile {
  constructor() {
    super(PALETTE.get(3)[0]);
    this.connectsToSand = true;
    this.connectsToWater = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
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

    const su = u && level.getTile(tx, ty - 1).connectsToSand;
    const sd = d && level.getTile(tx, ty + 1).connectsToSand;
    const sl = l && level.getTile(tx - 1, ty).connectsToSand;
    const sr = r && level.getTile(tx + 1, ty).connectsToSand;

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    if (!u && !l) {
      tileset.render(
        (Tile.tickCount + 1) % 4,
        topLeft,
        col,
        (Tile.tickCount - 2) % 4
      );
    } else {
      tileset.render(
        (l ? 14 : 15) + (u ? 0 : 1) * tileset.tilesPerRow,
        topLeft,
        su || sl ? transitionColor2 : transitionColor1,
        0
      );
    }

    if (!u && !r) {
      tileset.render(
        (Tile.tickCount + 3) % 4,
        topRight,
        col,
        (Tile.tickCount - 4) % 4
      );
    } else {
      tileset.render(
        (r ? 16 : 15) + (u ? 0 : 1) * tileset.tilesPerRow,
        topRight,
        su || sr ? transitionColor2 : transitionColor1,
        0
      );
    }

    if (!d && !l) {
      tileset.render(
        (Tile.tickCount + 5) % 4,
        bottomLeft,
        col,
        (Tile.tickCount - 6) % 4
      );
    } else {
      tileset.render(
        (l ? 14 : 15) + (d ? 2 : 1) * tileset.tilesPerRow,
        bottomLeft,
        sd || sl ? transitionColor2 : transitionColor1,
        0
      );
    }
    if (!d && !r) {
      tileset.render(
        (Tile.tickCount + 7) % 4,
        bottomRight,
        col,
        (Tile.tickCount - 8) % 4
      );
    } else {
      tileset.render(
        (r ? 16 : 15) + (d ? 2 : 1) * tileset.tilesPerRow,
        bottomRight,
        sd || sr ? transitionColor2 : transitionColor1,
        0
      );
    }
  }

  mayPass(level: Level, x: number, y: number, e: Entity) {
    return e.canSwim;
  }

  tick(level: Level, xt: number, yt: number) {
    let xn = xt;
    let yn = yt;

    if (Random.nextBoolean()) {
      xn += Random.nextInt(2) * 2 - 1;
    } else {
      yn += Random.nextInt(2) * 2 - 1;
    }

    if (level.getTile(xn, yn).equals(tiles.hole)) {
      level.setTile(xn, yn, this, 0);
    }
  }
}
