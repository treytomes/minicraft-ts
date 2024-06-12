import {Tile, Tiles} from './tiles/Tile';
import {LevelInfo} from '../shared/models/level-info';

const DEFAULT_WIDTH = 128;
const DEFAULT_HEIGHT = 128;
const DEFAULT_COLOR_GRASS = 141;
const DEFAULT_COLOR_DIRT = 322;
const DEFAULT_COLOR_SAND = 550;

type LevelProps = {
  depth: number;
  tileData: number[];
  metaData: number[];
  width?: number;
  height?: number;
  grassColor?: number;
  dirtColor?: number;
  sandColor?: number;
};

export default class Level {
  public readonly width: number;
  public readonly height: number;
  public readonly depth: number;

  private readonly tileData: number[];
  private readonly metaData: number[];
  // private entitiesInTiles: Entity[];

  public readonly grassColor: number;
  public readonly dirtColor: number;
  public readonly sandColor: number;
  public monsterDensity = 8;

  constructor(props: LevelProps) {
    this.depth = props.depth;
    this.tileData = props.tileData;
    this.metaData = props.metaData;
    this.width = props.width ?? DEFAULT_WIDTH;
    this.height = props.height ?? DEFAULT_HEIGHT;
    this.grassColor = props.grassColor ?? DEFAULT_COLOR_GRASS;
    this.dirtColor = props.dirtColor ?? DEFAULT_COLOR_DIRT;
    this.sandColor = props.sandColor ?? DEFAULT_COLOR_SAND;
  }

  serialize(): LevelInfo {
    return {
      depth: this.depth,
      tileData: this.tileData,
      metaData: this.metaData,
      width: this.width,
      height: this.height,
      grassColor: this.grassColor,
      dirtColor: this.dirtColor,
      sandColor: this.sandColor,
      monsterDensity: this.monsterDensity,
    };
  }

  getTile(x: number, y: number): Tile {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      // TODO: Maybe this should be an infiniteFall tile?  Makes sense for a flat world?
      return Tiles.water;
    }
    return Tile.getById(this.tileData[x + y * this.width]);
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
