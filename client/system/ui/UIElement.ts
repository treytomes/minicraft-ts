import {GameTime} from '../GameTime';
import {MouseEventProxy} from '../input';
import Rectangle from '../math/Rectangle';

/**
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */
export default class UIElement {
  static MOUSE_HOVER: UIElement | undefined = undefined;
  static MOUSE_FOCUS: UIElement | undefined = undefined;

  bounds: Rectangle;

  constructor(x: number, y: number, width: number, height: number) {
    this.bounds = new Rectangle(x, y, width, height);
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

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onMouseMove(e: MouseEventProxy) {
    UIElement.MOUSE_HOVER = this;
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
  update(time: GameTime) {}

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  render(time: GameTime) {}
}
