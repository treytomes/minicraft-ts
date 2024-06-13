import Level from '../Level';
import Entity from '../entities/Entity';
import {Tile} from './Tile';

export default class LiquidTile extends Tile {
  steppedOn(level: Level, xt: number, yt: number, entity: Entity): void {
    super.steppedOn(level, xt, yt, entity);
    entity.isSwimming = true;
  }
}
