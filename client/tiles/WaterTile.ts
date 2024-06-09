import Level from '../Level';
import {Tile, Tiles} from './Tile';
import {Color, PALETTE, TileSet} from '../system/display';
import {Camera} from '../Camera';
import Entity from '../entities/Entity';
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
      tileset.render({
        tileIndex: (Tile.tickCount + 1) % 4,
        pnt: topLeft,
        colors: col,
        bits: (Tile.tickCount - 2) % 4,
      });
    } else {
      tileset.render({
        tileIndex: (l ? 14 : 15) + (u ? 0 : 1) * tileset.tilesPerRow,
        pnt: topLeft,
        colors: su || sl ? transitionColor2 : transitionColor1,
        bits: 0,
      });
    }

    if (!u && !r) {
      tileset.render({
        tileIndex: (Tile.tickCount + 3) % 4,
        pnt: topRight,
        colors: col,
        bits: (Tile.tickCount - 4) % 4,
      });
    } else {
      tileset.render({
        tileIndex: (r ? 16 : 15) + (u ? 0 : 1) * tileset.tilesPerRow,
        pnt: topRight,
        colors: su || sr ? transitionColor2 : transitionColor1,
        bits: 0,
      });
    }

    if (!d && !l) {
      tileset.render({
        tileIndex: (Tile.tickCount + 5) % 4,
        pnt: bottomLeft,
        colors: col,
        bits: (Tile.tickCount - 6) % 4,
      });
    } else {
      tileset.render({
        tileIndex: (l ? 14 : 15) + (d ? 2 : 1) * tileset.tilesPerRow,
        pnt: bottomLeft,
        colors: sd || sl ? transitionColor2 : transitionColor1,
        bits: 0,
      });
    }
    if (!d && !r) {
      tileset.render({
        tileIndex: (Tile.tickCount + 7) % 4,
        pnt: bottomRight,
        colors: col,
        bits: (Tile.tickCount - 8) % 4,
      });
    } else {
      tileset.render({
        tileIndex: (r ? 16 : 15) + (d ? 2 : 1) * tileset.tilesPerRow,
        pnt: bottomRight,
        colors: sd || sr ? transitionColor2 : transitionColor1,
        bits: 0,
      });
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

    if (level.getTile(xn, yn).equals(Tiles.hole)) {
      level.setTile(xn, yn, this, 0);
    }
  }
}
