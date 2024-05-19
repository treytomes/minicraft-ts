import LevelGeneratorScene from './LevelGeneratorScene';
import PixelsTestScene from './PixelsTestScene';
import SpriteTestScene from './SpriteTestScene';
import Game from './system/Game';
import Scene from './system/Scene';
import {ButtonUIElement} from './system/ui';

export default class MainMenuScene extends Scene {
  constructor(game: Game) {
    super(game);

    let y = 10;

    const startButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'SPRITES',
      10,
      (y += 10)
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
      (y += 10)
    );
    pixelsButton.onClick = () => {
      this.enterScene(new PixelsTestScene(game));
    };
    this.uiElements.push(pixelsButton);

    const levelGenButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'LEVELGEN',
      10,
      (y += 10)
    );
    levelGenButton.onClick = () => {
      this.enterScene(new LevelGeneratorScene(game));
    };
    this.uiElements.push(levelGenButton);

    const exitButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'EXIT',
      10,
      (y += 10)
    );
    exitButton.onClick = () => {
      this.exitScene();
    };
    this.uiElements.push(exitButton);
  }
}
