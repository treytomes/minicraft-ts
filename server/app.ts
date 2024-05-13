import 'dotenv/config';
import { config } from './config';

import Main from './main';
import { app, BrowserWindow } from 'electron';
import { Environment } from './models';

console.log('Environment:', config.get('environment'));
console.log('Debug:', config.get('debug'));

if (config.get('environment') == Environment.dev) {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true
    });
  } catch (_) { console.log('Error'); }
}

Main.main(app, BrowserWindow);