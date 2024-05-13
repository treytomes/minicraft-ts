import 'dotenv/config';
import { config } from './config';

import Main from './main';
import { app, BrowserWindow } from 'electron';

console.log('Environment:', config.get('environment'));
console.log('Debug:', config.get('debug'));

Main.main(app, BrowserWindow);