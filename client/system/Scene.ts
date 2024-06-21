import InputHandler from '../InputHandler';
import Game from './Game';
import {GameTime} from './GameTime';
import {Font, Sprite, TileSet} from './display';
import {MouseEventProxy} from './input';
import {UIElement} from './ui';

export default class Scene {
  protected readonly game: Game;
  public readonly sprites: Sprite[] = [];

  protected get input(): InputHandler {
    return this.game.input;
  }

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

  loadContent() {}

  unloadContent() {}

  update(time: GameTime) {
    for (let n = 0; n < this.sprites.length; n++) {
      const sprite = this.sprites[n];
      sprite.update(time);
    }

    UIElement.ROOT.update(time);
  }

  render(time: GameTime) {
    for (let n = 0; n < this.sprites.length; n++) {
      const sprite = this.sprites[n];
      sprite.render(time);
    }

    UIElement.ROOT.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    UIElement.ROOT.onKeyDown(e);
  }

  onKeyUp(e: KeyboardEvent) {
    UIElement.ROOT.onKeyUp(e);
  }

  onMouseMove(e: MouseEventProxy) {
    UIElement.ROOT.onMouseMove(e);
  }

  onMouseDown(e: MouseEventProxy) {
    UIElement.ROOT.onMouseDown(e);
  }

  onMouseUp(e: MouseEventProxy) {
    UIElement.ROOT.onMouseUp(e);
  }

  enterScene(scene: Scene) {
    this.game.enterScene(scene);
  }

  exitScene() {
    this.game.exitScene();
  }
}
