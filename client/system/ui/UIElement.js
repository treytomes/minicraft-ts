import Rectangle from '../math/Rectangle.js';

/**
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */
export default class UIElement {
  static MOUSE_HOVER = undefined;
  static MOUSE_FOCUS = undefined;

  constructor(x, y, width, height) {
    this.bounds = new Rectangle(x, y, width, height);
  }

  /**
   * @returns {boolean} Is the mouse hovering over this UI element?
   */
  get hasMouseHover() {
    return UIElement.MOUSE_HOVER === this;
  }

  /**
   * @returns {boolean} Is the mouse focused on this UI element?
   */
  get hasMouseFocus() {
    return UIElement.MOUSE_FOCUS === this;
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseMove(e) {
    UIElement.MOUSE_HOVER = this;
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseDown(e) {
    UIElement.MOUSE_FOCUS = this;
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseUp(e) {
    UIElement.MOUSE_FOCUS = undefined;
  }

  update(deltaTime) { }
  render() {}
}
