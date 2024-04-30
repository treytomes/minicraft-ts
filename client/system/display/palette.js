import { Color } from "./index.js";

class Palette {
  constructor() {
    this.colors = [];
    for (let r = 0; r <= 5; r++) {
      for (let g = 0; g <= 5; g++) {
        for (let b = 0; b <= 5; b++) {
          const rr = Math.floor(r * 255 / 5);
          const gg = Math.floor(g * 255 / 5);
          const bb = Math.floor(b * 255 / 5);
          const mid = Math.floor((rr * 30 + gg * 59 + bb * 11) / 100);

          const r1 = Math.floor(((rr + mid * 1) / 2) * 230 / 255 + 10);
          const g1 = Math.floor(((gg + mid * 1) / 2) * 230 / 255 + 10);
          const b1 = Math.floor(((bb + mid * 1) / 2) * 230 / 255 + 10);
          
          // palette.push bitOr(bitOr(shl(r1, 16), shl(g1, 8)), b1)
          this.colors.push(new Color(r1, g1, b1));
        }
      }
    }
  }

  /**
   * Convert a set of rgb values into a set of colors.
   * 
   * @param {number} a The first rgb value to retrieve.
   * @param {number} b The second rgb value to retrieve.
   * @param {number} c The third rgb value to retrieve.
   * @param {number} d The fourth rgb value to retrieve. 
   * @returns {Color[]} A set of colors.
   */
  get4(a, b, c, d) {
    return [this.get(a), this.get(b), this.get(c), this.get(d)];
  }

  /**
   * Convert an rgb value into a color.
   * 
   * @param {number} d The rgb value to retrieve.
   * @returns {Color} A Color object.
   */
  get(d) {
    if (d < 0) return this.colors[255];
    const r = Math.floor(d / 100) % 10;
    const g = Math.floor(d / 10) % 10;
    const b = d % 10;
    return this.colors[r * 36 + g * 6 + b];
  }
}

export const PALETTE = new Palette();
