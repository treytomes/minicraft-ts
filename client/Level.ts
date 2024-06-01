import LevelGen from './LevelGen';
import * as tiles from './tiles';
import {Tile} from './tiles/Tile';

const DEFAULT_WIDTH = 128;
const DEFAULT_HEIGHT = 128;

export default class Level {
  public readonly width: number;
  public readonly height: number;
  public readonly depth: number;

  private readonly tileData: number[];
  private readonly metaData: number[];

  public readonly grassColor = 141;
  public readonly dirtColor = 322;
  public readonly sandColor = 550;

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

  getTile(x: number, y: number): Tile {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      // TODO: Maybe this should be an infiniteFall tile?  Makes sense for a flat world?
      return tiles.water;
    }
    return tiles.getById(this.tileData[x + y * this.width]);
  }

  setTile(x: number, y: number, tile: Tile, data: number) {
    this.tileData[x + y * this.width] = tile.id;
    this.metaData[x + y * this.width] = data;
  }

  getData(x: number, y: number) {
    return this.metaData[x + y * this.width];
  }

  setData(x: number, y: number, data: number) {
    this.metaData[x + y * this.width] = data;
  }
}
