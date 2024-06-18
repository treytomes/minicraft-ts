import * as system from './system';
import MinicraftGame from './MinicraftGame';

// const game = new MinicraftGame(160, 120); // Minicraft
const game = new MinicraftGame(256, 224); // SNES
system.initialize(game);
