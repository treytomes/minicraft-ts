import {Image} from 'image-js';

import path from 'node:path';
// import process from 'node:process';
import {TileInfo} from '../../../shared/models/tile-info';
// TODO: tsconfig path: @shared

// const ICONS_PATH = path.join(process.cwd(), './server/assets/icons.png');
const ICONS_PATH = path.join(__dirname, '../../assets/icons.png');

export const getTiles = async (): Promise<TileInfo> => {
  const image = await Image.load(ICONS_PATH);
  if (!(image.data instanceof Uint8Array)) {
    throw new Error('Image data is not Uint8Array.');
  }
  return {
    components: image.components,
    data: Array.from(image.data),
    height: image.height,
    width: image.width,
  };
};
