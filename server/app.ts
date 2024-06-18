import 'dotenv/config';
import {config} from './config';

import Main from './main';
import {app, BrowserWindow} from 'electron';
import logger from './logger';

logger.info('Environment:', config.get('environment'));
logger.info('Debug:', config.get('debug'));

Main.main(app, BrowserWindow);
