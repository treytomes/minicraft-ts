import Level from './Level';
import LevelGen from './LevelGen';
import {WorldInfo} from '../shared/models/world-info';
import Player from './entities/Player';
import EntityFactory from './entities/EntityFactory';
import {Camera} from './Camera';
import {TileSet} from './system/display';
import {Tile} from './tiles';

export default class World {
  private levels: Record<number, Level> = {};
  private _currentDepth = 0;
  public player: Player | undefined;

  get width() {
    return this.levels[0].width;
  }

  get height() {
    return this.levels[0].height;
  }

  get currentDepth() {
    return this._currentDepth;
  }

  set currentDepth(value: number) {
    if (
      Object.keys(this.levels)
        .map(x => parseInt(x))
        .includes(value)
    ) {
      this._currentDepth = value;
    } else {
      // throw new Error(`World does not include this depth: ${value}`);
    }
  }

  get currentLevel(): Level {
    return this.levels[this._currentDepth];
  }

  private constructor() {}

  static createNew(): World {
    const world = new World();

    world.levels[1] = LevelGen.createAndValidateMap(1);
    world.levels[0] = LevelGen.createAndValidateMap(0, world.levels[1]);
    world.levels[-1] = LevelGen.createAndValidateMap(-1, world.levels[0]);
    world.levels[-2] = LevelGen.createAndValidateMap(-2, world.levels[-1]);
    world.levels[-3] = LevelGen.createAndValidateMap(-3, world.levels[-2]);

    world.currentDepth = 0;
    world.player = EntityFactory.spawnPlayer(world.currentLevel);
    return world;
  }

  serialize(): WorldInfo {
    return {
      levels: Object.values(this.levels).map(x => x.serialize()),
      currentDepth: this._currentDepth,
    };
  }

  render(tileset: TileSet, camera: Camera) {
    for (let y = 0; y < this.currentLevel.height; y++) {
      for (let x = 0; x < this.currentLevel.width; x++) {
        const tile = this.currentLevel.getTile(x, y);
        tile.render(
          tileset,
          this.currentLevel,
          x * Tile.width,
          y * Tile.height,
          camera
        );
      }
    }

    this.player?.render(tileset, camera);
  }
}
