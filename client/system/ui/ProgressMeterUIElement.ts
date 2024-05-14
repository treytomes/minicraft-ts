import { GameTime } from "../GameTime";
import Color from "../display/Color";
import TileSet from "../display/TileSet";
import UIElement from "./UIElement";

export default class ProgressMeterUIElement extends UIElement {
  private tileset: TileSet;

  maxValue: number;
  currentValue: number | (() => number);
  tileIndex: number;
  onColor: Color[];
  offColor: Color[];

  constructor(x: number, y: number, maxValue: number, tileIndex: number, tileset: TileSet, onColor: Color[], offColor: Color[], currentValue: number | (() => number) | undefined = undefined) {
    super(x, y, tileset.tileWidth * maxValue, tileset.tileHeight);
    this.tileset = tileset;
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

  render(time: GameTime) {
    let value: number = 0;
    if (typeof this.currentValue === 'function') {
      value = this.currentValue();
    } else {
      value = this.currentValue;
    }

    for (let n = 0; n < this.maxValue; n++) {
      if (n < value) {
        this.tileset.render(this.tileIndex, this.bounds.x + n * this.tileset.tileWidth, this.bounds.y, this.onColor);
      } else {
        this.tileset.render(this.tileIndex, this.bounds.x + n * this.tileset.tileWidth, this.bounds.y, this.offColor);
      }
    }
  }
}