export default class Image {
  components: number;
  data: number[];
  height: number;
  width: number;

  constructor(data) {
    this.components = data.components;
    this.data = data.data;
    this.height = data.height;
    this.width = data.width;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {{r: number, g: number, b: number}}
   */
  getPixel(x, y) {
    const offset = y * this.width * this.components + x * this.components;
    const r = this.data[offset + 0];
    const g = this.data[offset + 1];
    const b = this.data[offset + 2];
    return {r, g, b};
  }
}
