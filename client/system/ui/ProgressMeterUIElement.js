import Color from "../display/Color.js";
import TileSet from "../display/TileSet.js";
import UIElement from "./UIElement.js";

export default class ProgressMeterUIElement extends UIElement {
  /**
   * @type {TileSet}
   */
  #tileset;

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} maxValue 
   * @param {number} tileIndex
   * @param {TileSet} tileset 
   * @param {Color[]} onColor
   * @param {Color[]} offColor
   * @param {()=>number | undefined} currentValue
   */
  constructor(x, y, maxValue, tileIndex, tileset, onColor, offColor, currentValue=undefined) {
    super(x, y, tileset.tileWidth * maxValue, tileset.tileHeight);
    this.#tileset = tileset;
    this.maxValue = maxValue;
    if (currentValue) {
      this.currentValue = currentValue;
    } else {
      this.currentValue = this.maxValue;
    }
    this.tileIndex = tileIndex;
    this.onColor = onColor;
    this.offColor = offColor;
  }

  render() {
    let value = this.currentValue;
    if (typeof this.currentValue === 'function') {
      value = this.currentValue();
    }
    for (let n = 0; n < this.maxValue; n++) {
      if (n < value) {
        this.#tileset.render(this.tileIndex, this.bounds.x + n * this.#tileset.tileWidth, this.bounds.y, this.onColor);
      } else {
        this.#tileset.render(this.tileIndex, this.bounds.x + n * this.#tileset.tileWidth, this.bounds.y, this.offColor);
      }
    }
  }
}
