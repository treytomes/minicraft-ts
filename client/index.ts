import * as system from './system';
import * as event_bus from './event_bus';
import MinicraftGame from './MinicraftGame';

// Attach event_bus to the window.
event_bus.initialize();

// const game = new MinicraftGame(160, 120); // Minicraft
const game = new MinicraftGame(256, 224); // SNES
// 1280x800???

system.initialize(game);
