import * as system from './system';
import {EventBus} from './system/data/events';
import {ResourceManager} from './system/data/resources';
import MinicraftGame from './MinicraftGame';
import * as sounds from './sounds';

const ASSET_ROOT_PATH = 'assets';
EventBus.initialize();
ResourceManager.initialize(ASSET_ROOT_PATH);
await sounds.loadContent();

// const game = new MinicraftGame(160, 120); // Minicraft
const game = new MinicraftGame(256, 224); // SNES
// 1280x800???

system.initialize(game);
