import Game from './system/Game';
import {GameTime} from './system/GameTime';

import './resources'; // most resources need to be defined before the tiles...
import './tiles';

import MainMenuScene from './scenes/MainMenuScene';
import {PALETTE, clear} from './system/display';
// ...but some resources need to be defined after the tiles!

export default class MinicraftGame extends Game {
  constructor(width: number, height: number) {
    super(width, height);
  }

  async loadContent() {
    await super.loadContent();

    // this.scenes.push(new SpriteTestScene(this));
    this.scenes.push(new MainMenuScene(this));
  }

  render(time: GameTime) {
    clear(PALETTE.get(0)[0]);
    super.render(time);
  }
}
