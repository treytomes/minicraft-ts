import 'dotenv/config';
import { config } from './config';

import Main from './main';
import { app, BrowserWindow } from 'electron';

import * as watcher from './watcher';

console.log('Environment:', config.get('environment'));
console.log('Debug:', config.get('debug'));

watcher.beginWatching();

Main.main(app, BrowserWindow);