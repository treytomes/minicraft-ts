import {Font, TileSet} from './system/display';
import Image from './system/display/Image';
// import * as img from 'image-js';
// import Image from './system/display/Image';

// TODO: Need a better resource manager.

const ICONS_PATH = 'assets/icons.png';

// const loadImage = async (path: string): Promise<Image> => {
//   const imgData = await img.Image.load(path);
//   return new Image({
//     components: imgData.components,
//     data: Array.from(imgData.data),
//     height: imgData.height,
//     width: imgData.width,
//   });
// };

// const loadIcons = async (): Promise<TileSet> => {
//   const image = await loadImage(ICONS_PATH);
//   return new TileSet(image, 8, 8);
// };

export default class GlobalResources {
  public static tileset: TileSet;
  public static font: Font;

  static async initialize() {
    this.tileset = new TileSet(
      await window.resources.load<Image>(ICONS_PATH),
      8,
      8
    );
    this.font = new Font(this.tileset);
  }
}
