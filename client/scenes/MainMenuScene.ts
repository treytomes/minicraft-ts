import LevelGeneratorScene from './LevelGeneratorScene';
import LevelRendererScene from './LevelRendererScene';
import PixelsTestScene from './PixelsTestScene';
import SpriteTestScene from './SpriteTestScene';
import Game from '../system/Game';
import Scene from '../system/Scene';
import {Keys} from '../system/input';
import {ButtonUIElement} from '../system/ui';
import SoundEffectTestScene from './SoundEffectTestScene';
import GameplayScene from './GameplayScene';

export default class MainMenuScene extends Scene {
  constructor(game: Game) {
    super(game);

    let y = 10;

    const newGameButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'NEW GAME',
      10,
      (y += 10)
    );
    newGameButton.onClick = () => {
      this.enterScene(new GameplayScene(game));
    };
    this.uiElements.push(newGameButton);

    // const spritesButton = new ButtonUIElement(
    //   this.tileset,
    //   this.font,
    //   'SPRITES',
    //   10,
    //   (y += 10)
    // );
    // spritesButton.onClick = () => {
    //   this.enterScene(new SpriteTestScene(game));
    // };
    // this.uiElements.push(spritesButton);

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

    const levelRendererButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'LEVEL',
      10,
      (y += 10)
    );
    levelRendererButton.onClick = () => {
      this.enterScene(new LevelRendererScene(game));
    };
    this.uiElements.push(levelRendererButton);

    const sfxTestButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'SFX',
      10,
      (y += 10)
    );
    sfxTestButton.onClick = () => {
      this.enterScene(new SoundEffectTestScene(game));
    };
    this.uiElements.push(sfxTestButton);

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

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    switch (e.key) {
      case Keys.Escape:
        this.exitScene();
        break;
    }
  }
}
