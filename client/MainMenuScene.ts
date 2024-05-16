import PixelsTestScene from './PixelsTestScene';
import SpriteTestScene from './SpriteTestScene';
import Game from './system/Game';
import Scene from './system/Scene';
import {ButtonUIElement} from './system/ui';

export default class MainMenuScene extends Scene {
  constructor(game: Game) {
    super(game);

    const startButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'SPRITES',
      10,
      10
    );
    startButton.onClick = () => {
      this.enterScene(new SpriteTestScene(game));
    };
    this.uiElements.push(startButton);

    const pixelsButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'PIXELS',
      10,
      20
    );
    pixelsButton.onClick = () => {
      this.enterScene(new PixelsTestScene(game));
    };
    this.uiElements.push(pixelsButton);

    const exitButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'EXIT',
      10,
      30
    );
    exitButton.onClick = () => {
      this.exitScene();
    };
    this.uiElements.push(exitButton);
  }
}
