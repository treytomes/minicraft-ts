import Image from './display/Image';
import {Font, Sprite, TileSet, createContext} from './display';
import {GameTime} from './GameTime';
import {MouseEventProxy} from './input';
import Scene from './Scene';
import * as img from 'image-js';

export default class Game {
  private _width: number;
  private _height: number;
  private _tileset: TileSet | undefined;
  private _font: Font | undefined;
  private _mouseCursor: Sprite | undefined;
  public readonly scenes: Scene[] = [];

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

    const ICONS_PATH = 'assets/icons.png';
    const imgData = await img.Image.load(ICONS_PATH);
    const image = new Image({
      components: imgData.components,
      data: Array.from(imgData.data),
      height: imgData.height,
      width: imgData.width,
    });
    // const image = new Image(await window.api.gfx.getTiles());

    this._tileset = new TileSet(image, 8, 8);
    this._font = new Font(this._tileset);
    this._mouseCursor = new Sprite(this.tileset, 0, 29, [-1, 1, 112, 445], 1);
  }

  update(time: GameTime) {
    if (this.currentScene === null) window.api.system.exit(0);
    this.currentScene?.update(time);
    this.mouseCursor.update(time);
  }

  render(time: GameTime) {
    this.currentScene?.render(time);
    this.mouseCursor.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    this.currentScene?.onKeyDown(e);
  }

  onKeyUp(e: KeyboardEvent) {
    this.currentScene?.onKeyUp(e);
  }

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
