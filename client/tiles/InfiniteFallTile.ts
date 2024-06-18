import {Camera} from '../Camera';
import Level from '../Level';
import AirWizard from '../entities/AirWizard';
import Entity from '../entities/Entity';
import {PALETTE, TileSet} from '../system/display';
import {Tile} from './Tile';

// TODO: If a Mob steps on this tile, but can't float, it should fall.

export default class InfiniteFallTile extends Tile {
  constructor() {
    super(PALETTE.get(0)[0]);
  }

  render(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tileset: TileSet,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    x: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    y: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    camera: Camera
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    if (e instanceof AirWizard) return true;
    return false;
  }
}
