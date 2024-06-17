import Level from '../../Level';
import {GameTime} from '../../system/GameTime';
import Entity from '../Entity';

export default class Particle extends Entity {
  protected time = 0;
  protected lifeSpan: number;

  constructor(x: number, y: number) {
    super();
    this.moveTo(x, y);
    this.lifeSpan = 0;
  }

  update(time: GameTime, level: Level) {
    super.update(time, level);

    this.time += time.deltaTime;

    if (this.time > this.lifeSpan) {
      this.remove();
    }
  }
}
