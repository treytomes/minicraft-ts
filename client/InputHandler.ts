import Action from './Action';
import {GameTime} from './system/GameTime';
import {Keys} from './system/input';

export default class InputHandler {
  up = new Action();
  down = new Action();
  left = new Action();
  right = new Action();
  attack = new Action();
  menu = new Action();
  exit = new Action();

  actions = [
    this.up,
    this.down,
    this.left,
    this.right,
    this.attack,
    this.menu,
    this.exit,
  ];

  releaseAll() {
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i].release();
    }
  }

  update(time: GameTime) {
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i].update(time);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    this.toggle(e, true);
  }

  onKeyUp(e: KeyboardEvent) {
    this.toggle(e, false);
  }

  private toggle(e: KeyboardEvent, pressed: boolean) {
    switch (e.key) {
      case Keys.ArrowUp:
        this.up.toggle(pressed);
        break;
      case Keys.ArrowDown:
        this.down.toggle(pressed);
        break;
      case Keys.ArrowLeft:
        this.left.toggle(pressed);
        break;
      case Keys.ArrowRight:
        this.right.toggle(pressed);
        break;
      case Keys.Tab:
        this.menu.toggle(pressed);
        break;
      case Keys.Space:
        this.attack.toggle(pressed);
        break;
      case Keys.Escape:
        this.exit.toggle(pressed);
        break;
    }
  }
}
