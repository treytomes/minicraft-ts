import Action from './Action';
import {GameTime} from './system/GameTime';
import {Keys} from './system/input';
import {Point} from './system/math';

export default class InputHandler {
  up = new Action();
  down = new Action();
  left = new Action();
  right = new Action();
  attack = new Action();
  inventory = new Action();
  examine = new Action();
  exit = new Action();

  actions = [
    this.up,
    this.down,
    this.left,
    this.right,
    this.attack,
    this.inventory,
    this.examine,
    this.exit,
  ];

  axis(axisName: 'horizontal' | 'vertical'): Point {
    if (axisName === 'horizontal') {
      if (this.left.down) return Point.unitX.negate;
      if (this.right.down) return Point.unitX;
    } else {
      if (this.up.down) return Point.unitY.negate;
      if (this.down.down) return Point.unitY;
    }
    return Point.zero;
  }

  get direction(): Point {
    const h = this.axis('horizontal');
    const v = this.axis('vertical');
    return h.add(v);
  }

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

  // TODO: Store these key bindings in a config file.  Or localStorage.
  private toggle(e: KeyboardEvent, pressed: boolean) {
    switch (e.key) {
      case Keys.ArrowUp:
      case Keys.w:
        this.up.toggle(pressed);
        break;
      case Keys.ArrowDown:
      case Keys.s:
        this.down.toggle(pressed);
        break;
      case Keys.ArrowLeft:
      case Keys.a:
        this.left.toggle(pressed);
        break;
      case Keys.ArrowRight:
      case Keys.d:
        this.right.toggle(pressed);
        break;
      case Keys.i:
        this.inventory.toggle(pressed);
        break;
      case Keys.e:
        this.examine.toggle(pressed);
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
