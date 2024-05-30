import {TileSet} from '../system/display';
import Level from '../Level';
import {Color, fillRect} from '../system/display';
import {GameTime} from '../system/GameTime';
import {Camera} from '../Camera';
import {Rectangle} from '../system/math';

const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;
const TILE_TICKRATE_MS = 300;

export const tiles: Tile[] = [];

export class Tile {
  public static readonly width: number = TILE_WIDTH;
  public static readonly height: number = TILE_HEIGHT;
  public static tickCount = 0;
  private static lastTickMs = 0;

  public readonly id: number;
  public readonly mapColor: Color;
  public connectsToSand = false;
  public connectsToWater = false;

  constructor(mapColor: Color) {
    this.id = tiles.length;
    tiles.push(this);
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
}
