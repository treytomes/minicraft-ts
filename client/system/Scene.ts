import Game from './Game';
import {GameTime} from './GameTime';
import {Font, Sprite, TileSet} from './display';
import {MouseEventProxy} from './input';
import {UIElement} from './ui';
import RootElement from './ui/RootElement';

export default class Scene {
  private game: Game;
  public readonly sprites: Sprite[] = [];
  // public readonly uiElements: UIElement[] = [];
  public readonly uiRoot = new RootElement();

  protected get tileset(): TileSet {
    return this.game.tileset;
  }

  protected get font(): Font {
    return this.game.font;
  }

  protected get width(): number {
    return this.game.width;
  }

  protected get height(): number {
    return this.game.height;
  }

  constructor(game: Game) {
    this.game = game;
  }

  update(time: GameTime) {
    for (let n = 0; n < this.sprites.length; n++) {
      const sprite = this.sprites[n];
      sprite.update(time);
    }

    // for (let n = 0; n < this.uiElements.length; n++) {
    //   const uiElement = this.uiElements[n];
    //   uiElement.update(time);
    // }

    this.uiRoot.update(time);
  }

  render(time: GameTime) {
    for (let n = 0; n < this.sprites.length; n++) {
      const sprite = this.sprites[n];
      sprite.render(time);
    }

    // for (let n = 0; n < this.uiElements.length; n++) {
    //   const uiElement = this.uiElements[n];
    //   uiElement.render(time);
    // }

    this.uiRoot.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    this.uiRoot.onKeyDown(e);
  }

  onKeyUp(e: KeyboardEvent) {
    this.uiRoot.onKeyUp(e);
  }

  onMouseMove(e: MouseEventProxy) {
    this.uiRoot.onMouseMove(e);
  }

  onMouseDown(e: MouseEventProxy) {
    this.uiRoot.onMouseDown(e);
  }

  onMouseUp(e: MouseEventProxy) {
    this.uiRoot.onMouseUp(e);
  }

  enterScene(scene: Scene) {
    this.game.scenes.push(scene);
  }

  exitScene() {
    this.game.scenes.pop();
  }
}
