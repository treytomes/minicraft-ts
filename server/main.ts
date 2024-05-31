import {BrowserWindow, IpcMainInvokeEvent, ipcMain} from 'electron';
import * as api from './api';
import {config} from './config';
import * as paths from './paths';
import {default as logger} from './logger';

export default class Main {
  static mainWindow: Electron.BrowserWindow | null;
  static application: Electron.App;
  static BrowserWindow: typeof BrowserWindow;

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit();
    }
  }

  private static onClose() {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  private static createWindow() {
    Main.mainWindow = new Main.BrowserWindow({
      width: 1280,
      height: 720,
      icon: paths.getClientPath('favicon.ico'),
      webPreferences: {
        // nodeIntegration: true,
        // contextIsolation: false,
        preload: paths.getPreloadPath('preload-bundle.js'),
      },
    });

    if (!Main.mainWindow) throw new Error('Unable to create main window.');

    logger.debug('index: ', paths.getClientPath('index.html'));
    Main.mainWindow.loadFile(paths.getClientPath('index.html'));
    Main.mainWindow.on('closed', Main.onClose);

    if (config.get('debug')) Main.mainWindow.webContents.openDevTools();
  }

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  private static onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      Main.createWindow();
    }
  }

  private static onReady() {
    logger.info('Hello from Electron 👋');

    ipcMain.handle('sample/ping', async () => {
      logger.debug('Calling sample/ping.');
      return await (await api).sample.ping();
      // await api.sample.ping();
    });

    ipcMain.handle('gfx/getTiles', async () => {
      logger.debug('Calling gfx/getTiles.');
      return await (await api).gfx.getTiles();
    });

    ipcMain.handle('sfx/loadWave', async (event: IpcMainInvokeEvent, path) => {
      logger.debug(`Calling sfx/loadWave: ${path}`);
      return await (await api).sfx.loadWave(path);
    });

    ipcMain.handle('system/config', () => {
      return {
        debug: config.get('debug'),
        environment: config.get('environment'),
      };
    });

    ipcMain.handle(
      'system/exit',
      async (event: IpcMainInvokeEvent, exitCode) => {
        logger.debug(`Calling system/exit: ${exitCode}`);
        Main.application.exit(exitCode);
      }
    );

    Main.createWindow();
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on('activate', Main.onActivate);
    Main.application.on('ready', Main.onReady);
    Main.application.on('window-all-closed', Main.onWindowAllClosed);
  }
}
