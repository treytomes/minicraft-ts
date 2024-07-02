import {Direction} from '../Direction';
import Level from '../Level';
import Player from '../entities/Player';
import {Color} from '../system/display';
import {Tile} from '../tiles/Tile';

export const Resources: Record<string, Resource> = {};

export class Resource {
  public readonly name: string;

  // TODO: What should I call this?  tileIndex, icon, etc?
  public readonly icon: number;
  public readonly color: Color[];

  constructor(name: string, icon: number, color: Color[]) {
    if (name.length > 6)
      throw new Error('Name cannot be longer than six characters!');
    this.name = name;
    this.icon = icon;
    this.color = color;
  }

  // TODO: I still feel like attackDir should be an enum.  Or maybe a vector.
  interactOn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tile: Tile,
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
}
