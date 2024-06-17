import {Tile, Tiles} from './tiles/Tile';
import {LevelInfo} from '../shared/models/level-info';
import {TileSet} from './system/display';
import {Camera} from './Camera';
import Entity from './entities/Entity';
import {GameTime} from './system/GameTime';
import Random from './system/math/Random';
import Player from './entities/Player';

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

  player?: Player;

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

  getEntities(x0: number, y0: number, x1: number, y1: number): Entity[] {
    const result: Entity[] = [];
    const xt0 = (x0 >> 4) - 1;
    const yt0 = (y0 >> 4) - 1;
    const xt1 = (x1 >> 4) + 1;
    const yt1 = (y1 >> 4) + 1;
    for (let y = yt0; y <= yt1; y++) {
      for (let x = xt0; x <= xt1; x++) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) continue;
        const entities = this.entitiesInTiles[x + y * this.width];
        for (let i = 0; i < entities.length; i++) {
          const e = entities[i];
          if (e.bounds.intersects(x0, y0, x1, y1)) result.push(e);
        }
      }
    }
    return result;
  }

  add(e: Entity) {
    if (e instanceof Player) this.player = e;

    e.removed = false;
    this.entities.push(e);
    this.insertEntity(e.position.x / Tile.width, e.position.y / Tile.height, e);
  }

  remove(e: Entity) {
    if (e instanceof Player) this.player = undefined;

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
    const viewbox = camera.viewbox;
    for (let y = viewbox.top >> 4; y <= (viewbox.bottom >> 4) + 1; y++) {
      for (let x = viewbox.left >> 4; x <= (viewbox.right >> 4) + 1; x++) {
        const tile = this.getTile(x, y);
        tile.render(tileset, this, x * Tile.width, y * Tile.height, camera);
      }
    }

    const entities = this.getEntities(
      viewbox.left,
      viewbox.top,
      viewbox.right,
      viewbox.bottom
    );
    for (let n = 0; n < entities.length; n++) {
      entities[n].render(tileset, camera);
    }
  }

  update(time: GameTime) {
    // TODO: Attempt to spawn a new mob?
    // trySpawn(1);

    // Tick a random number of tiles.
    for (let i = 0; i < (this.width * this.height) / 50; i++) {
      // TODO: I think I might rather tick every time every frame, but I'm not sure.
      const xt = Random.nextInt(this.width);
      const yt = Random.nextInt(this.height);
      this.getTile(xt, yt).tick(this, xt, yt);
    }

    for (let i = 0; i < this.entities.length; i++) {
      const e = this.entities[i];
      const xto = e.position.x >> 4;
      const yto = e.position.y >> 4;

      e.update(time, this);

      if (e.removed) {
        this.entities.splice(i, 1);
        i--;
        this.removeEntity(xto, yto, e);
      } else {
        const xt = e.position.x >> 4;
        const yt = e.position.y >> 4;

        if (xto !== xt || yto !== yt) {
          this.removeEntity(xto, yto, e);
          this.insertEntity(xt, yt, e);
        }
      }
    }
  }
}
