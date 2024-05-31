import * as fs from 'fs';
import * as path from 'path';
import * as dataurl from 'dataurl';

export const loadWave = async (filePath: string): Promise<string> => {
  const ASSETS_PATH = path.join(process.cwd(), './server/assets');
  const songPromise = new Promise<string>((resolve, reject) => {
    fs.readFile(path.join(ASSETS_PATH, filePath), (err, data) => {
      if (err) {
        reject(err);
      }
      const result = dataurl.convert({data, mimetype: 'audio/wav'}) as string;
      resolve(result);
    });
  });
  return await songPromise;
};
