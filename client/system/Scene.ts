import Game from "./Game";
import { GameTime } from "./GameTime";
import { Font, Sprite, TileSet } from "./display";
import { MouseEventProxy } from "./input";
import { UIElement } from "./ui";

export default class Scene {
  private game: Game;
  public readonly sprites: Sprite[] = [];
  public readonly uiElements: UIElement[] = [];

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

    for (let n = 0; n < this.uiElements.length; n++) {
      const uiElement = this.uiElements[n];
      uiElement.update(time);
    }
  }

  render(time: GameTime) {
    for (let n = 0; n < this.sprites.length; n++) {
      const sprite = this.sprites[n];
      sprite.render(time);
    }

    for (let n = 0; n < this.uiElements.length; n++) {
      const uiElement = this.uiElements[n];
      uiElement.render(time);
    }
  }

  onKeyDown(e: KeyboardEvent) { }

  onKeyUp(e: KeyboardEvent) { }

  onMouseMove(e: MouseEventProxy) {
    UIElement.MOUSE_HOVER = undefined;
    for (let n = 0; n < this.uiElements.length; n++) {
      const uiElement = this.uiElements[n];
      // console.log(uiElement.bounds, e.clientX, e.clientY);
      if (uiElement.bounds.contains(e.clientX, e.clientY)) {
        uiElement.onMouseMove(e);
        break;
      }
    }
  }

  onMouseDown(e: MouseEventProxy) {
    // Is the left mouse button pressed?
    if (e.button === 0) {
      UIElement.MOUSE_FOCUS = undefined;
      if (UIElement.MOUSE_HOVER) {
        UIElement.MOUSE_HOVER.onMouseDown(e);
      }
    }
  }

  onMouseUp(e: MouseEventProxy) {
    if (e.button === 0) {
      if (UIElement.MOUSE_FOCUS) {
        UIElement.MOUSE_FOCUS.onMouseUp(e);
      }
    }
  }
}
