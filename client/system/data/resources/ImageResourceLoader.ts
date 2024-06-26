import Image from '../../display/Image';
import IResourceLoader from './IResourceLoader';
import * as img from 'image-js';

export default class ImageResourceLoader implements IResourceLoader<Image> {
  readonly exts = ['png', 'jpg'];

  async load(path: string): Promise<Image> {
    const imgData = await img.Image.load(path);
    return new Image({
      components: imgData.components,
      data: Array.from(imgData.data),
      height: imgData.height,
      width: imgData.width,
    });
  }
}
