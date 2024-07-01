import {Camera} from '../Camera';
import Level from '../Level';
import Entity from '../entities/Entity';
import {PALETTE, TileSet} from '../system/display';
import {Tile} from './Tile';

export default class HoleTile extends Tile {
  constructor() {
    super(PALETTE.get(0)[0]);
    this.connectsToSand = true;
    this.connectsToWater = true;
    this.connectsToLava = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(111, 111, 110, 110);
    const transitionColor1 = PALETTE.get(
      3,
      111,
      level.dirtColor - 111,
      level.dirtColor
    );
    const transitionColor2 = PALETTE.get(
      3,
      111,
      level.sandColor - 110,
      level.sandColor
    );

    // TODO: top-right icon is wrong.
    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const u = !level.getTile(tx, ty - 1).connectsToLiquid;
    const d = !level.getTile(tx, ty + 1).connectsToLiquid;
    const l = !level.getTile(tx - 1, ty).connectsToLiquid;
    const r = !level.getTile(tx + 1, ty).connectsToLiquid;

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
      tileset.render({pnt: topLeft, tileIndex: 0, colors: col});
    } else {
      tileset.render({
        pnt: topLeft,
        tileIndex: (l ? 14 : 15) + (u ? 0 : 1) * 32,
        colors: su || sl ? transitionColor2 : transitionColor1,
      });
    }

    if (!u && !r) {
      tileset.render({pnt: topRight, tileIndex: 1, colors: col});
    } else {
      tileset.render({
        pnt: bottomLeft,
        tileIndex: (r ? 16 : 15) + (u ? 0 : 1) * 32,
        colors: su || sr ? transitionColor2 : transitionColor1,
      });
    }

    if (!d && !l) {
      tileset.render({pnt: bottomLeft, tileIndex: 2, colors: col});
    } else {
      tileset.render({
        pnt: bottomLeft,
        tileIndex: (l ? 14 : 15) + (d ? 2 : 1) * 32,
        colors: sd || sl ? transitionColor2 : transitionColor1,
      });
    }

    if (!d && !r) {
      tileset.render({pnt: bottomRight, tileIndex: 3, colors: col});
    } else {
      tileset.render({
        pnt: bottomRight,
        tileIndex: (r ? 16 : 15) + (d ? 2 : 1) * 32,
        colors: sd || sr ? transitionColor2 : transitionColor1,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    return e.canSwim;
  }
}
