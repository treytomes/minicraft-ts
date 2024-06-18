import {Tile} from '.';
import {Camera} from '../Camera';
import Level from '../Level';
import {GameTime} from '../system/GameTime';
import {PALETTE, TileSet} from '../system/display';

export class SaplingTile extends Tile {
  private onType: Tile;
  private growsTo: Tile;

  constructor(onType: Tile, growsTo: Tile) {
    super(PALETTE.get(10)[0]);
    this.onType = onType;
    this.growsTo = growsTo;
    this.connectsToSand = onType.connectsToSand;
    this.connectsToGrass = onType.connectsToGrass;
    this.connectsToWater = onType.connectsToWater;
    this.connectsToLava = onType.connectsToLava;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    this.onType.render(tileset, level, x, y, camera);
    const col = PALETTE.get(10, 40, 50, -1);
    tileset.render({
      x: x * 16 + 4,
      y: y * 16 + 4,
      tileIndex: 11 + 3 * 32,
      colors: col,
    });
  }

  tick(time: GameTime, level: Level, xt: number, yt: number) {
    const age = level.getData(xt, yt) + time.deltaTime / 32;
    if (age > 100) {
      level.setTile(xt, yt, this.growsTo, 0);
    } else {
      level.setData(xt, yt, age);
    }
  }

  // TODO: I feel like it should drop something.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hurtTile(level: Level, x: number, y: number, dmg: number) {
    level.setTile(x, y, this.onType, 0);
  }
}
