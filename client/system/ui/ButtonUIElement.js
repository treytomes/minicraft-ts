import { BIT_MIRROR_X, PALETTE } from '../display/index.js';
import Color from "../display/Color.js";
import Font from "../display/Font.js";
import TileSet from "../display/TileSet.js";
import UIElement from "./UIElement.js";

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
  /**
   * @param {TileSet} tileset 
   * @param {Font} font 
   * @param {any} text 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(tileset, font, text, x, y) {
    super(x, y, font.width * text.length + tileset.tileWidth * 2, font.height);

    this.tileset = tileset;
    this.font = font;
    this.text = text;
    this.chromeColors = PALETTE.get4(222, -1, -1, -1);
    this.textColors = PALETTE.get4(222, -1, -1, 550);
    this.onClick = () => { };
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseUp(e) {
    super.onMouseUp(e);
    this.onClick();
  }

  update(deltaTime) {
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
