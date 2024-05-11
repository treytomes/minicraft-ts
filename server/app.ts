import Main from './main';
import { app, BrowserWindow } from 'electron';

import dotenv from 'dotenv';
dotenv.config();
import { config } from './config';

console.log('Execution environment:', config.get('environment'));

Main.main(app, BrowserWindow);