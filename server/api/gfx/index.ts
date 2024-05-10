import { Image } from 'image-js';

import path from 'node:path';
import process from 'node:process';

const ICONS_PATH = path.join(process.cwd(), './server/assets/icons.png');

export type TileInfo = {
  components: number,
  data: Uint8Array,
  height: number,
  width: number,
}

export const getTiles = async (): Promise<TileInfo> => {
  const image = await Image.load(ICONS_PATH);
  if (!(image.data instanceof Uint8Array)) {
    throw new Error('Image data is not Uint8Array.');
  }
  return {
    components: image.components,
    data: image.data,
    height: image.height,
    width: image.width,
  };
};
