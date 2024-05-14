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
      'STRT',
      10,
      10
    );
    startButton.onClick = () => {
      this.enterScene(new SpriteTestScene(game));
    };
    this.uiElements.push(startButton);

    const exitButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'EXIT',
      10,
      10
    );
    exitButton.onClick = () => {
      this.exitScene();
    };
    this.uiElements.push(exitButton);
  }
}
