import LevelGeneratorScene from './LevelGeneratorScene';
import LevelRendererScene from './LevelRendererScene';
import PixelsTestScene from './PixelsTestScene';
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
      (y += 10),
      this.uiRoot
    );
    newGameButton.onClick = () => {
      this.enterScene(new GameplayScene(game));
    };

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
      (y += 10),
      this.uiRoot
    );
    pixelsButton.onClick = () => {
      this.enterScene(new PixelsTestScene(game));
    };

    const levelGenButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'LEVELGEN',
      10,
      (y += 10),
      this.uiRoot
    );
    levelGenButton.onClick = () => {
      this.enterScene(new LevelGeneratorScene(game));
    };

    const levelRendererButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'LEVEL',
      10,
      (y += 10),
      this.uiRoot
    );
    levelRendererButton.onClick = () => {
      this.enterScene(new LevelRendererScene(game));
    };

    const sfxTestButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'SFX',
      10,
      (y += 10),
      this.uiRoot
    );
    sfxTestButton.onClick = () => {
      this.enterScene(new SoundEffectTestScene(game));
    };

    const exitButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'EXIT',
      10,
      (y += 10),
      this.uiRoot
    );
    exitButton.onClick = () => {
      this.exitScene();
    };
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
