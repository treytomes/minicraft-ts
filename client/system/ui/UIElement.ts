import {GameTime} from '../GameTime';
import {MouseEventProxy} from '../input';
import {Point} from '../math';
import Rectangle from '../math/Rectangle';

/**
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */
export default class UIElement {
  static MOUSE_HOVER?: UIElement;
  static MOUSE_FOCUS?: UIElement;
  static KEYBOARD_FOCUS?: UIElement;

  parent?: UIElement;
  bounds: Rectangle;
  children: UIElement[] = [];

  private get absoluteX(): number {
    if (!this.parent) {
      return this.bounds.x;
    } else {
      return this.bounds.x + this.parent.absoluteX;
    }
  }

  private get absoluteY(): number {
    if (!this.parent) {
      return this.bounds.y;
    } else {
      return this.bounds.y + this.parent.absoluteY;
    }
  }

  get absoluteBounds(): Rectangle {
    return new Rectangle(
      this.absoluteX,
      this.absoluteY,
      this.bounds.width,
      this.bounds.height
    );
  }

  /**
   * @returns {boolean} Is the mouse hovering over this UI element?
   */
  get hasMouseHover(): boolean {
    return UIElement.MOUSE_HOVER === this;
  }

  /**
   * @returns {boolean} Is the mouse focused on this UI element?
   */
  get hasMouseFocus(): boolean {
    return UIElement.MOUSE_FOCUS === this;
  }

  constructor(bounds: Rectangle, parent?: UIElement) {
    this.bounds = bounds;
    this.parent = parent;
  }

  moveTo(pnt: Point) {
    this.bounds = this.bounds.moveTo(pnt);
  }

  acquireKeyboardFocus() {
    UIElement.KEYBOARD_FOCUS = this;
  }

  loseKeyboardFocus() {
    if (UIElement.KEYBOARD_FOCUS === this) {
      UIElement.KEYBOARD_FOCUS = undefined;
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onKeyDown(e: KeyboardEvent) {}

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onKeyUp(e: KeyboardEvent) {}

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onMouseMove(e: MouseEventProxy) {
    UIElement.MOUSE_HOVER = this;
    for (let n = 0; n < this.children.length; n++) {
      const uiElement = this.children[n];
      // console.log(uiElement.bounds, e.clientX, e.clientY);
      if (uiElement.absoluteBounds.contains(e.clientX, e.clientY)) {
        uiElement.onMouseMove(e);
        break;
      }
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onMouseDown(e: MouseEventProxy) {
    UIElement.MOUSE_FOCUS = this;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onMouseUp(e: MouseEventProxy) {
    UIElement.MOUSE_FOCUS = undefined;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  update(time: GameTime) {
    // Update from the top down.
    for (let n = this.children.length - 1; n >= 0; n--) {
      this.children[n].update(time);
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  render(time: GameTime) {
    // Render from the bottom up.
    for (let n = 0; n < this.children.length; n++) {
      this.children[n].render(time);
    }
  }
}
