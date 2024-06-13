import {Camera} from '../Camera';
import Level from '../Level';
import Random from '../system/math/Random';
import Entity from '../entities/Entity';
import {PALETTE, TileSet} from '../system/display';
import {Tile, Tiles} from './Tile';
import LiquidTile from './LiquidTile';

// TODO: LavaTile and WaterTile should inherit from LiquidTile.
export default class LavaTile extends LiquidTile {
  constructor() {
    super(PALETTE.get(511)[0]);
    this.connectsToSand = true;
    this.connectsToLava = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(500, 500, 520, 550);
    const transitionColor1 = PALETTE.get(
      3,
      500,
      level.dirtColor - 111,
      level.dirtColor
    );
    const transitionColor2 = PALETTE.get(
      3,
      500,
      level.sandColor - 110,
      level.sandColor
    );

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = !level.getTile(tx, ty - 1).connectsToLava;
    const d = !level.getTile(tx, ty + 1).connectsToLava;
    const l = !level.getTile(tx - 1, ty).connectsToLava;
    const r = !level.getTile(tx + 1, ty).connectsToLava;

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

  // TODO: Shouldn't it hurt to swim in lava?

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLightRadius(level: Level, x: number, y: number) {
    return 6;
  }
}
