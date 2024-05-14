import Game from "./system/Game";
import SpriteTestScene from "./SpriteTestScene";
import { GameTime } from "./system/GameTime";

export default class MinicraftGame extends Game {
  constructor(width: number, height: number) {
    super(width, height);
  }

  async loadContent() {
    await super.loadContent();
    this.scenes.push(new SpriteTestScene(this));
  }

  render(time: GameTime) {
    super.render(time);
  }
}
