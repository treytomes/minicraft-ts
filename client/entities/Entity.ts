import Level from '../Level';
import {Sprite, TileSet} from '../system/display';
import {Tile} from '../tiles/Tile';
import Mob from './Mob';

// TODO: Finish implementing Entity.
export default class Entity extends Sprite {
  level: Level | undefined;

  constructor(tileset: TileSet, xt: number, yt: number, colors: number[]) {
    super(tileset, xt, yt, colors, 2);
  }

  get canSwim() {
    return false;
  }

  hurt(mob: Mob, dmg: number, attackDir: number): void;
  hurt(tile: Tile, x: number, y: number, dmg: number): void;
  hurt(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mobOrTile: Mob | Tile,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dmgOrX: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDirOrY: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dmg?: number
  ) {}
}
