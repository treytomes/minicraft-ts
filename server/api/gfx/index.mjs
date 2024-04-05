import { Image } from 'image-js';

import path from 'node:path';
import process from 'node:process';

const ICONS_PATH = path.join(process.cwd(), './server/assets/icons.png');

/**
 * @returns {{components: number, data: UInt8Array, height: number, width: number}}
 */
export const getTiles = async () => {
  const image = await Image.load(ICONS_PATH);
  return {
    components: image.components,
    data: image.data,
    height: image.height,
    width: image.width,
  };
};
