import {Sprite, TileSet} from '../system/display';

export default class Entity extends Sprite {
  constructor(tileset: TileSet, xt: number, yt: number, colors: number[]) {
    super(tileset, xt, yt, colors, 2);
  }

  get canSwim() {
    return false;
  }
}
