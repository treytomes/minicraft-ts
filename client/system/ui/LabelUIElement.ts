import { PALETTE } from '../display/palette';
import UIElement from './UIElement';
import { Color, Font } from '../display';

/**
 * A Label that can be positioned anywhere on the screen.
 * 
 * @property {Font} font
 * @property {any} text The value to render.  If this is a function, the result will be reevaluated at the time of render.
 * @property {number} x
 * @property {number} y
 */
export default class LabelUIElement extends UIElement {
  font: Font;
  text: any;
  colors: Color[];

  /**
   * @param {Font} font 
   * @param {any} text 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(font: Font, text: any, x: number, y: number) {
    super(x, y, font.width * text.length, font.height);

    this.font = font;
    this.text = text;
    this.colors = PALETTE.get4(-1, -1, -1, 550);
  }

  update(deltaTime: number) { }

  render() {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    this.font.render(text?.toString() ?? 'null', this.bounds.x, this.bounds.y, this.colors);
  }
}
