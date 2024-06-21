import LevelGeneratorScene from './LevelGeneratorScene';
import LevelRendererScene from './LevelRendererScene';
import PixelsTestScene from './PixelsTestScene';
import Scene from '../system/Scene';
import {Keys} from '../system/input';
import {ButtonUIElement, UIElement} from '../system/ui';
import SoundEffectTestScene from './SoundEffectTestScene';
import GameplayScene from './GameplayScene';

export default class MainMenuScene extends Scene {
  private newGameButton!: ButtonUIElement;
  private pixelsButton!: ButtonUIElement;
  private levelGenButton!: ButtonUIElement;
  private levelRendererButton!: ButtonUIElement;
  private sfxTestButton!: ButtonUIElement;
  private exitButton!: ButtonUIElement;

  loadContent() {
    let y = 10;

    this.newGameButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'NEW GAME',
      10,
      (y += 10),
      UIElement.ROOT
    );
    this.newGameButton.onClick = () => {
      this.enterScene(new GameplayScene(this.game));
    };

    this.pixelsButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'PIXELS',
      10,
      (y += 10),
      UIElement.ROOT
    );
    this.pixelsButton.onClick = () => {
      this.enterScene(new PixelsTestScene(this.game));
    };

    this.levelGenButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'LEVELGEN',
      10,
      (y += 10),
      UIElement.ROOT
    );
    this.levelGenButton.onClick = () => {
      this.enterScene(new LevelGeneratorScene(this.game));
    };

    this.levelRendererButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'LEVEL',
      10,
      (y += 10),
      UIElement.ROOT
    );
    this.levelRendererButton.onClick = () => {
      this.enterScene(new LevelRendererScene(this.game));
    };

    this.sfxTestButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'SFX',
      10,
      (y += 10),
      UIElement.ROOT
    );
    this.sfxTestButton.onClick = () => {
      this.enterScene(new SoundEffectTestScene(this.game));
    };

    this.exitButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'EXIT',
      10,
      (y += 10),
      UIElement.ROOT
    );
    this.exitButton.onClick = () => {
      this.exitScene();
    };
  }

  unloadContent() {
    console.log('Closing all the things.');
    this.newGameButton.close();
    this.pixelsButton.close();
    this.levelGenButton.close();
    this.levelRendererButton.close();
    this.sfxTestButton.close();
    this.exitButton.close();
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
