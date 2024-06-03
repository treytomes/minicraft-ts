import Color from './Color';
import TileSet from './TileSet';

export default class Font {
  private chars =
    '' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ      ' +
    '0123456789.,!?\'"-+=/\\%()<>:;     ' +
    '';

  private tileset: TileSet;

  constructor(tileset: TileSet) {
    this.tileset = tileset;
  }

  get width() {
    return this.tileset.tileWidth;
  }

  get height() {
    return this.tileset.tileHeight;
  }

  /**
   * Write some text to the screen.
   *
   * @param {string} msg The text to write.
   * @param {number} x The x-position to write at.
   * @param {number} y The y-position to write at.
   * @param {Color[]} col The color array to color the text with.
   */
  render(msg: string, x: number, y: number, col: Color[]) {
    msg = msg.toUpperCase();
    for (let i = 0; i < msg.length; i++) {
      const ix = this.chars.indexOf(msg[i]);
      if (ix >= 0) {
        this.tileset.render({
          tileIndex: ix + 30 * 32,
          x: x + i * 8,
          y,
          colors: col,
        });
      }
    }
  }
}
