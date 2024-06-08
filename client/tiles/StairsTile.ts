import {PALETTE, TileSet} from '../system/display';
import {Tile} from './Tile';
import {Camera} from '../Camera';
import Level from '../Level';

export default class StairsTile extends Tile {
  leadsUp: boolean;

  constructor(leadsUp: boolean) {
    super(PALETTE.get(555)[0]);

    this.leadsUp = leadsUp;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const colors = PALETTE.get(level.dirtColor, 0, 333, 444);
    let xt = 0;
    if (this.leadsUp) xt = 2;

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    tileset.render({pnt: topLeft, tileIndex: xt + 2 * 32, colors});
    tileset.render({pnt: topRight, tileIndex: xt + 1 + 2 * 32, colors});
    tileset.render({pnt: bottomLeft, tileIndex: xt + 3 * 32, colors});
    tileset.render({pnt: bottomRight, tileIndex: xt + 1 + 3 * 32, colors});
  }
}
