import logger from '../logger';
import * as sample from './sample';
import * as gfx from './gfx';
import * as file from './file';
import {config} from '../config';
import {IpcMainInvokeEvent} from 'electron';
import {WorldInfo} from '../../shared/models/world-info';

type RegisterProps = {
  ipcMain: Electron.IpcMain;
  application: Electron.App;
};

export const register = (props: RegisterProps) => {
  props.ipcMain.handle('sample/ping', async () => {
    logger.debug('Calling sample/ping.');
    return await sample.ping();
    // await api.sample.ping();
  });

  props.ipcMain.handle('gfx/getTiles', async () => {
    logger.debug('Calling gfx/getTiles.');
    return await gfx.getTiles();
  });

  props.ipcMain.handle(
    'file/save',
    async (event: IpcMainInvokeEvent, world: WorldInfo) => {
      logger.debug('Calling file/save.');
      return await file.save(world);
    }
  );

  props.ipcMain.handle('system/config', () => {
    return {
      debug: config.get('debug'),
      environment: config.get('environment'),
    };
  });

  props.ipcMain.handle(
    'system/exit',
    async (event: IpcMainInvokeEvent, exitCode: number) => {
      logger.debug(`Calling system/exit: ${exitCode}`);
      props.application.exit(exitCode);
    }
  );
};
