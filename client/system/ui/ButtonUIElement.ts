import { BIT_MIRROR_X, PALETTE } from '../display/index';
import Color from "../display/Color";
import Font from "../display/Font";
import TileSet from "../display/TileSet";
import UIElement from "./UIElement";
import { MouseEventProxy } from '../input';

/**
 * @property {TileSet} tileset
 * @property {Font} font
 * @property {string} text
 * @property {number} x
 * @property {number} y
 * @property {Color[]} chromeColors
 * @property {Color[]} textColors
 */
export default class ButtonUIElement extends UIElement {
  tileset: TileSet;
  font: Font;
  text: any;
  chromeColors: Color[];
  textColors: Color[];
  onClick: () => void;

  /**
   * @param {TileSet} tileset 
   * @param {Font} font 
   * @param {any} text 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(tileset: TileSet, font: Font, text: any, x: number, y: number) {
    super(x, y, font.width * text.length + tileset.tileWidth * 2, font.height);

    this.tileset = tileset;
    this.font = font;
    this.text = text;
    this.chromeColors = PALETTE.get4(222, -1, -1, -1);
    this.textColors = PALETTE.get4(222, -1, -1, 550);
    this.onClick = () => { };
  }

  onMouseUp(e: MouseEventProxy) {
    super.onMouseUp(e);
    this.onClick();
  }

  update(deltaTime: number) {
    if (this.hasMouseFocus) {
      this.chromeColors[0] = PALETTE.get(111);
      this.textColors[0] = PALETTE.get(111);
    } else if (this.hasMouseHover) {
      this.chromeColors[0] = PALETTE.get(333);
      this.textColors[0] = PALETTE.get(333);
    } else {
      this.chromeColors[0] = PALETTE.get(222);
      this.textColors[0] = PALETTE.get(222);
    }
  }

  render() {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    text = text?.toString() ?? 'null';

    // Left side of button.
    this.tileset.render(1 + 29 * 32, this.bounds.x, this.bounds.y, this.chromeColors);

    // Button text.
    this.font.render(text, this.bounds.x + this.tileset.tileWidth, this.bounds.y, this.textColors);

    // Right side of button.
    this.tileset.render(
      1 + 29 * 32,
      this.bounds.x + this.tileset.tileWidth + text.length * this.tileset.tileWidth,
      this.bounds.y,
      this.chromeColors,
      BIT_MIRROR_X
    );
  }
}
