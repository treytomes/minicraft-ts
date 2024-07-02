import {Font, TileSet} from './system/display';

// TODO: Need a better resource manager.

export default class GlobalResources {
  public static tileset: TileSet;
  public static font: Font;

  static async initialize() {
    this.tileset = await window.resources.load(TileSet, 'tileset.json');
    this.font = await window.resources.load(Font, 'font.json');
  }
}
