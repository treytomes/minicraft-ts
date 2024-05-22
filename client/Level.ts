import LevelGen from './LevelGen';
import * as tiles from './tiles';

const DEFAULT_WIDTH = 128;
const DEFAULT_HEIGHT = 128;

export default class Level {
  public readonly width: number;
  public readonly height: number;
  public readonly depth: number;

  private readonly tileData: number[];
  private readonly metaData: number[];

  constructor(
    depth: number,
    width: number | undefined = undefined,
    height: number | undefined = undefined
  ) {
    this.depth = depth;
    this.width = width ?? DEFAULT_WIDTH;
    this.height = height ?? DEFAULT_HEIGHT;

    if (this.depth === -1) {
      const data = LevelGen.createAndValidateSkyMap(this.width, this.height);
      this.tileData = data[0];
      this.metaData = data[1];
    } else if (this.depth === 0) {
      const data = LevelGen.createAndValidateTopMap(this.width, this.height);
      this.tileData = data[0];
      this.metaData = data[1];
    } else {
      const data = LevelGen.createAndValidateUndergroundMap(
        this.width,
        this.height,
        this.depth
      );
      this.tileData = data[0];
      this.metaData = data[1];
    }
  }

  getTile(x: number, y: number): tiles.Tile {
    return tiles.getById(this.tileData[x + y * this.width]);
  }
}
