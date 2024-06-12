import {WorldInfo} from '../../../shared/models/world-info';
import * as fs from 'fs';
import * as path from 'path';

const SAVE_FOLDER = path.join(__dirname, '../../../saves/');

export const save = (world: WorldInfo) => {
  // Generate a datestamp from the current date and time.
  const datestamp = new Date().toISOString().replace(/:/g, '-');

  // Stringify the world data.
  const data = JSON.stringify(world);

  // Create the `SAVE_FOLDER` path if it does not exist.
  if (!fs.existsSync(SAVE_FOLDER)) {
    fs.mkdirSync(SAVE_FOLDER);
  }

  const filePath = path.join(SAVE_FOLDER, `${datestamp}.json`);
  fs.writeFileSync(filePath, data);

  return filePath;
};
