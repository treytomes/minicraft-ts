import Image from './display/Image';
import {Font, Sprite, TileSet, createContext} from './display';
import {GameTime} from './GameTime';
import {MouseEventProxy} from './input';
import Scene from './Scene';
import InputHandler from '../InputHandler';
import {UIElement} from './ui';
import RootElement from './ui/RootElement';
import GlobalResources from '../GlobalResources';

export default class Game {
  private _width: number;
  private _height: number;
  private _tileset: TileSet | undefined;
  private _font: Font | undefined;
  private _mouseCursor: Sprite | undefined;
  private readonly scenes: Scene[] = [];
  public readonly input = new InputHandler();

  get tileset(): TileSet {
    if (!this._tileset) throw new Error('Content is not loaded.');
    return this._tileset;
  }

  get font(): Font {
    if (!this._font) throw new Error('Content is not loaded.');
    return this._font;
  }

  get mouseCursor(): Sprite {
    if (!this._mouseCursor) throw new Error('Content is not loaded.');
    return this._mouseCursor;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get currentScene(): Scene | null {
    if (this.scenes.length === 0) return null;
    return this.scenes[this.scenes.length - 1];
  }

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  /**
   * Load asynchronous content before starting the game loop.
   */
  async loadContent() {
    await createContext(this._width, this._height);

    UIElement.ROOT = new RootElement(this.input);

    // TODO: Use _tileset from GlobalResources.
    this._tileset = await window.resources.load(TileSet, 'tileset.json');
    this._font = await window.resources.load(Font, 'font.json');
    this._mouseCursor = new Sprite(this.tileset, 0, 29, [-1, 1, 112, 445], 1);

    await GlobalResources.initialize();
  }

  enterScene(scene: Scene) {
    this.currentScene?.unloadContent();
    this.scenes.push(scene);
    this.currentScene?.loadContent();
  }

  exitScene() {
    this.currentScene?.unloadContent();
    this.scenes.pop();
    this.currentScene?.loadContent();
  }

  update(time: GameTime) {
    if (this.currentScene === null) window.api.system.exit(0);
    this.input.update(time);
    this.currentScene?.update(time);
    this.mouseCursor.update(time);
  }

  render(time: GameTime) {
    this.currentScene?.render(time);
    this.mouseCursor.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    this.input.onKeyDown(e);
    this.currentScene?.onKeyDown(e);
  }

  onKeyUp(e: KeyboardEvent) {
    this.input.onKeyUp(e);
    this.currentScene?.onKeyUp(e);
  }

  // TODO: onMouseMove can move to an InputHandles.axis?
  onMouseMove(e: MouseEventProxy) {
    this.mouseCursor.moveTo(e.clientX, e.clientY);
    this.currentScene?.onMouseMove(e);
  }

  onMouseDown(e: MouseEventProxy) {
    this.currentScene?.onMouseDown(e);
  }

  onMouseUp(e: MouseEventProxy) {
    this.currentScene?.onMouseUp(e);
  }
}
