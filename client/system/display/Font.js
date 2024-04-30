import Color from "./Color.js";
import TileSet from "./TileSet.js";

export default class Font {
  #chars = "" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ      " +
    "0123456789.,!?'\"-+=/\\%()<>:;     " +
    "";
  
  /**
   * @type {TileSet}
   */
  #tileset;
  
  /**
   * @param {TileSet} tileset 
   */
  constructor(tileset) {
    this.#tileset = tileset;
  }

  get width() {
    return this.#tileset.tileWidth;
  }

  get height() {
    return this.#tileset.tileHeight;
  }

  /**
   * Write some text to the screen.
   * 
   * @param {string} msg The text to write.
   * @param {number} x The x-position to write at.
   * @param {number} y The y-position to write at.
   * @param {Color[]} col The color array to color the text with.
   */
  render(msg, x, y, col) {
    msg = msg.toUpperCase();
    for (let i = 0; i < msg.length; i++) {
			const ix = this.#chars.indexOf(msg[i]);
      if (ix >= 0) {
        this.#tileset.render(ix + 30 * 32, x + i * 8, y, col);
      }
    }
  }
}
