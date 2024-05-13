import fs from 'fs';
import * as paths from './paths';
import Main from './main';

// TODO: This isn't currently working.  It should though.  Not sure why it's not, or if it's worth fixing.
export const beginWatching = async () => {
  const watchDir = paths.getClientPath('.');
  console.log(`Begin watching for client changes: ${watchDir}`);

  const watcher = fs.watch(watchDir);
  watcher.on('change', () => {
    Main.mainWindow?.reload();
  });
};
