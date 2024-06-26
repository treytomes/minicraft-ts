import {PALETTE} from '../display/palette';
import UIElement from './UIElement';
import {Color, Font} from '../display';
import {GameTime} from '../GameTime';
import {Rectangle} from '../math';

/**
 * A Label that can be positioned anywhere on the screen.
 */
export default class LabelUIElement extends UIElement {
  font: Font;

  /**
   * The value to render.  If this is a function, the result will be reevaluated at the time of render.
   */
  text: string | number | (() => string);

  colors: Color[];

  constructor(
    font: Font,
    text: string | number | (() => string),
    x: number,
    y: number,
    parent: UIElement
  ) {
    const len = (typeof text === 'function' ? text() : text.toString()).length;
    super(new Rectangle(x, y, font.width * len, font.height), parent);

    this.font = font;
    this.text = text;
    this.colors = PALETTE.get(-1, -1, -1, 550);
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  update(time: GameTime) {}

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  render(time: GameTime) {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    this.font.render(
      text?.toString() ?? 'null',
      this.absoluteBounds.x,
      this.absoluteBounds.y,
      this.colors
    );

    // console.log('label:', text, this.bounds);
  }
}
