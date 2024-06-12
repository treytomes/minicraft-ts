import Level from './Level';
import LevelGen from './LevelGen';
import {WorldInfo} from '../shared/models/world-info';

export default class World {
  private levels: Record<number, Level> = {};
  private _currentDepth = 0;

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

  constructor() {
    this.levels[1] = LevelGen.createAndValidateMap(1);
    this.levels[0] = LevelGen.createAndValidateMap(0, this.levels[1]);
    this.levels[-1] = LevelGen.createAndValidateMap(-1, this.levels[0]);
    this.levels[-2] = LevelGen.createAndValidateMap(-2, this.levels[-1]);
    this.levels[-3] = LevelGen.createAndValidateMap(-3, this.levels[-2]);
  }

  serialize(): WorldInfo {
    return {
      levels: Object.values(this.levels).map(x => x.serialize()),
      currentDepth: this._currentDepth,
    };
  }
}
