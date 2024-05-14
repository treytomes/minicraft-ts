import {BIT_MIRROR_X, PALETTE} from '../display/index';
import Color from '../display/Color';
import Font from '../display/Font';
import TileSet from '../display/TileSet';
import UIElement from './UIElement';
import {MouseEventProxy} from '../input';
import {GameTime} from '../GameTime';

export default class ButtonUIElement extends UIElement {
  tileset: TileSet;
  font: Font;
  text: string | number | (() => string);
  chromeColors: Color[];
  textColors: Color[];
  onClick: () => void;

  constructor(
    tileset: TileSet,
    font: Font,
    text: string | number | (() => string),
    x: number,
    y: number
  ) {
    const len = (typeof text === 'function' ? text() : text.toString()).length;
    super(x, y, font.width * len + tileset.tileWidth * 2, font.height);

    this.tileset = tileset;
    this.font = font;
    this.text = text;
    this.chromeColors = PALETTE.get(222, -1, -1, -1);
    this.textColors = PALETTE.get(222, -1, -1, 550);
    this.onClick = () => {};
  }

  onMouseUp(e: MouseEventProxy) {
    super.onMouseUp(e);
    this.onClick();
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  update(time: GameTime) {
    if (this.hasMouseFocus) {
      this.chromeColors[0] = PALETTE.get(111)[0];
      this.textColors[0] = PALETTE.get(111)[0];
    } else if (this.hasMouseHover) {
      this.chromeColors[0] = PALETTE.get(333)[0];
      this.textColors[0] = PALETTE.get(333)[0];
    } else {
      this.chromeColors[0] = PALETTE.get(222)[0];
      this.textColors[0] = PALETTE.get(222)[0];
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  render(time: GameTime) {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    text = text?.toString() ?? 'null';

    // Left side of button.
    this.tileset.render(
      1 + 29 * 32,
      this.bounds.x,
      this.bounds.y,
      this.chromeColors
    );

    // Button text.
    this.font.render(
      text,
      this.bounds.x + this.tileset.tileWidth,
      this.bounds.y,
      this.textColors
    );

    // Right side of button.
    this.tileset.render(
      1 + 29 * 32,
      this.bounds.x +
        this.tileset.tileWidth +
        text.length * this.tileset.tileWidth,
      this.bounds.y,
      this.chromeColors,
      BIT_MIRROR_X
    );
  }
}
