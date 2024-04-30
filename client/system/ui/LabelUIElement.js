import { PALETTE } from '../display/palette.js';
import Font from '../display/Font.js';
import UIElement from './UIElement.js';

/**
 * A Label that can be positioned anywhere on the screen.
 * 
 * @property {Font} font
 * @property {any} text The value to render.  If this is a function, the result will be reevaluated at the time of render.
 * @property {number} x
 * @property {number} y
 */
export default class LabelUIElement extends UIElement {
  /**
   * @param {Font} font 
   * @param {any} text 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(font, text, x, y) {
    super(x, y, font.width * text.length, font.height);

    this.font = font;
    this.text = text;
    this.colors = PALETTE.get4(-1, -1, -1, 550);
  }

  update(deltaTime) {}

  render() {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    this.font.render(text?.toString() ?? 'null', this.bounds.x, this.bounds.y, this.colors);
  }
}
