import Resource from '../data/resources/Resource';

type ImageProps = {
  components: number;
  data: number[];
  height: number;
  width: number;
};

export default class Image extends Resource<ImageProps> {
  components!: number;
  data!: number[];
  height!: number;
  width!: number;

  async loadContent(props: ImageProps) {
    this.components = props.components;
    this.data = props.data;
    this.height = props.height;
    this.width = props.width;
  }

  getPixel(x: number, y: number): {r: number; g: number; b: number} {
    const offset = y * this.width * this.components + x * this.components;
    const r = this.data[offset + 0];
    const g = this.data[offset + 1];
    const b = this.data[offset + 2];
    return {r, g, b};
  }
}
