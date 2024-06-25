import {Direction} from '../Direction';
import Level from '../Level';
import Player from '../entities/Player';
import {Color} from '../system/display';
import {Tile} from '../tiles/Tile';
import {Resource} from './Resource';

export default class PlantableResource extends Resource {
  private sourceTiles: Tile[];
  private targetTile: Tile;

  constructor(
    name: string,
    sprite: number,
    color: Color[],
    targetTile: Tile,
    sourceTiles: Tile[]
  ) {
    super(name, sprite, color);
    this.sourceTiles = sourceTiles;
    this.targetTile = targetTile;
  }

  interactOn(
    tile: Tile,
    level: Level,
    xt: number,
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: Direction
  ): boolean {
    if (this.sourceTiles.includes(tile)) {
      level.setTile(xt, yt, this.targetTile, 0);
      return true;
    }
    return false;
  }
}
