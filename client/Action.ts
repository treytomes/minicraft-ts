import {GameTime} from './system/GameTime';

export default class Action {
  presses = 0;
  absorbs = 0;
  down = false;
  clicked = false;

  release() {
    this.down = false;
    this.clicked = false;
    this.absorbs = 0;
    this.presses = 0;
  }

  toggle(pressed: boolean) {
    if (pressed !== this.down) {
      this.down = pressed;
    }
    if (pressed) {
      this.presses++;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: GameTime) {
    if (this.absorbs < this.presses) {
      this.absorbs++; // += time.deltaTime / 32;
      this.clicked = true;
    } else {
      this.clicked = false;
    }
  }
}
