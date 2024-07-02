import Player from '../entities/Player';
import Furniture from '../entities/furniture/Furniture';
import FurnitureItem from '../items/FurnitureItem';
import Recipe from './Recipe';

export default class FurnitureRecipe<
  TFurniture extends Furniture,
> extends Recipe {
  private furnitureType: {new (): TFurniture};

  constructor(furnitureType: {new (): TFurniture}) {
    super(new FurnitureItem(new furnitureType()));
    this.furnitureType = furnitureType;
  }

  craft(player: Player) {
    player.inventory.add(new FurnitureItem(new this.furnitureType()), 0);
  }
}
