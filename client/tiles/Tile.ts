import {TileSet} from '../system/display';
import Level from '../Level';
import {Color, fillRect} from '../system/display';
import {GameTime} from '../system/GameTime';
import {Camera} from '../Camera';
import {Rectangle} from '../system/math';
import Entity from '../entities/Entity';
import Mob from '../entities/Mob';
import Item from '../items/Item';
import Player from '../entities/Player';
import {Direction} from '../Direction';

const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;
const TILE_TICKRATE_MS = 300;

export const Tiles: Record<string, Tile> = {};
const indexedTiles: Tile[] = [];

export class Tile {
  public static readonly width: number = TILE_WIDTH;
  public static readonly height: number = TILE_HEIGHT;
  public static tickCount = 0;
  private static lastTickMs = 0;

  public readonly id: number;
  public readonly mapColor: Color;
  public connectsToGrass = false;
  public connectsToLava = false;
  public connectsToSand = false;
  public connectsToWater = false;

  get connectsToLiquid() {
    return this.connectsToWater || this.connectsToLava;
  }

  constructor(mapColor: Color) {
    this.id = indexedTiles.length;
    indexedTiles.push(this);
    this.mapColor = mapColor;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    fillRect(
      camera.translate(new Rectangle(x, y, Tile.width, Tile.height)),
      this.mapColor
    );
  }

  static updateTicks(time: GameTime) {
    if (time.totalTime - Tile.lastTickMs > TILE_TICKRATE_MS) {
      Tile.tickCount++;
      Tile.lastTickMs = time.totalTime;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(time: GameTime, level: Level, xt: number, yt: number) {}

  equals(tile: Tile) {
    return tile && tile.id === this.id;
  }

  interact(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    item: Item,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: Direction
  ): boolean {
    return false;
  }

  hurt(
    level: Level,
    x: number,
    y: number,
    source: Mob,
    dmg: number,
    attackDir: Direction
  ): void;
  hurt(level: Level, x: number, y: number, dmg: number): void;
  hurt(
    level: Level,
    x: number,
    y: number,
    sourceOrDmg: Mob | number,
    dmg?: number,
    attackDir?: number
  ) {
    if (!(sourceOrDmg instanceof Mob)) {
      this.hurtTile(level, x, y, sourceOrDmg as number);
    } else {
      this.hurtMob(level, x, y, sourceOrDmg as Mob, dmg!, attackDir!);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hurtTile(level: Level, x: number, y: number, dmg: number) {}

  protected hurtMob(
    level: Level,
    x: number,
    y: number,
    source: Mob,
    dmg: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: Direction
  ) {
    this.hurtTile(level, x, y, dmg);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bumpedInto(level: Level, x: number, y: number, entity: Entity) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLightRadius(level: Level, x: number, y: number) {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  steppedOn(level: Level, xt: number, yt: number, entity: Entity) {}

  use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: Direction
  ): boolean {
    return false;
  }

  static getById(tileId: number) {
    return indexedTiles[tileId];
  }
}
