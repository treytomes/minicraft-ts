import {TileSet} from '../system/display';

export default interface ListItem {
  renderInventory(tileset: TileSet, i: number, j: number): void;
}
