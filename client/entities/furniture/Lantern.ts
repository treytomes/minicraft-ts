import {PALETTE} from '../../system/display';
import {Point} from '../../system/math';
import Furniture from './Furniture';

export default class Lantern extends Furniture {
  constructor() {
    super('Lantern');
    this.col = PALETTE.get(-1, 0, 111, 555);
    this.icon = 5;
    this.size = new Point(6, 4);
  }

  get lightRadius() {
    return 8;
  }
}
