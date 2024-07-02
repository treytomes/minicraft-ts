import {TileSet} from '../system/display';

export default interface IListableItem {
  renderInventory(tileset: TileSet, i: number, j: number): void;
}
