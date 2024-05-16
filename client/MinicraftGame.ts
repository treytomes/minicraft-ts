import Game from './system/Game';
import {GameTime} from './system/GameTime';
import MainMenuScene from './MainMenuScene';
import {PALETTE, clear} from './system/display';

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
