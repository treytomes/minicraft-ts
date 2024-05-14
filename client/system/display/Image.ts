import {TileInfo} from '../../../shared/models/tile-info';

export default class Image {
  components: number;
  data: number[];
  height: number;
  width: number;

  constructor(data: TileInfo) {
    this.components = data.components;
    this.data = data.data;
    this.height = data.height;
    this.width = data.width;
  }

  getPixel(x: number, y: number): {r: number; g: number; b: number} {
    const offset = y * this.width * this.components + x * this.components;
    const r = this.data[offset + 0];
    const g = this.data[offset + 1];
    const b = this.data[offset + 2];
    return {r, g, b};
  }
}
