import InputHandler from '../InputHandler';
import Game from './Game';
import {GameTime} from './GameTime';
import {Font, Sprite, TileSet} from './display';
import {MouseEventProxy} from './input';
import RootElement from './ui/RootElement';

export default class Scene {
  private game: Game;
  public readonly sprites: Sprite[] = [];
  public readonly uiRoot: RootElement;

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
    this.uiRoot = new RootElement(this.input);
  }

  update(time: GameTime) {
    for (let n = 0; n < this.sprites.length; n++) {
      const sprite = this.sprites[n];
      sprite.update(time);
    }

    this.uiRoot.update(time);
  }

  render(time: GameTime) {
    for (let n = 0; n < this.sprites.length; n++) {
      const sprite = this.sprites[n];
      sprite.render(time);
    }

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
