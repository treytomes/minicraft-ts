import {Tile, Tiles} from './tiles/Tile';
import {LevelInfo} from '../shared/models/level-info';
import {TileSet} from './system/display';
import {Camera} from './Camera';
import Entity from './entities/Entity';
import {GameTime} from './system/GameTime';

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

  public readonly grassColor: number;
  public readonly dirtColor: number;
  public readonly sandColor: number;
  public monsterDensity = 8;

  private readonly tileData: number[];
  private readonly metaData: number[];
  private readonly entities: Entity[] = [];
  private readonly entitiesInTiles: Entity[][] = [];

  constructor(props: LevelProps) {
    this.depth = props.depth;
    this.tileData = props.tileData;
    this.metaData = props.metaData;
    this.width = props.width ?? DEFAULT_WIDTH;
    this.height = props.height ?? DEFAULT_HEIGHT;
    this.grassColor = props.grassColor ?? DEFAULT_COLOR_GRASS;
    this.dirtColor = props.dirtColor ?? DEFAULT_COLOR_DIRT;
    this.sandColor = props.sandColor ?? DEFAULT_COLOR_SAND;

    for (let i = 0; i < this.width * this.height; i++) {
      this.entitiesInTiles[i] = [];
    }
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

  add(e: Entity) {
    e.removed = false;
    this.entities.push(e);
    this.insertEntity(e.position.x / Tile.width, e.position.y / Tile.height, e);
  }

  remove(e: Entity) {
    const index = this.entities.indexOf(e);
    if (index < 0) return;
    this.entities.splice(index, 1);
    const xto = e.position.x / Tile.width;
    const yto = e.position.y / Tile.height;
    this.removeEntity(xto, yto, e);
  }

  private insertEntity(x: number, y: number, e: Entity) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    x = Math.floor(x);
    y = Math.floor(y);
    this.entitiesInTiles[x + y * this.width].push(e);
  }

  private removeEntity(x: number, y: number, e: Entity) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    x = Math.floor(x);
    y = Math.floor(y);
    const arr = this.entitiesInTiles[x + y * this.width];
    const index = arr.indexOf(e);
    if (index >= 0) arr.splice(index, 1);
  }

  render(tileset: TileSet, camera: Camera) {
    // TODO: Only render tiles that are on-screen.
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.getTile(x, y);
        tile.render(tileset, this, x * Tile.width, y * Tile.height, camera);
      }
    }

    // TODO: Only render entities that are on-screen.
    for (let n = 0; n < this.entities.length; n++) {
      this.entities[n].render(tileset, camera);
    }
  }

  update(time: GameTime) {
    for (let n = 0; n < this.entities.length; n++) {
      this.entities[n].update(time, this);
    }
  }
}
