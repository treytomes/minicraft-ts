import Player from '../entities/Player';
import ResourceItem from '../items/ResourceItem';
import {Resource} from '../resources';
import Recipe from './Recipe';

export default class ResourceRecipe extends Recipe {
  private resource: Resource;

  constructor(resource: Resource) {
    super(new ResourceItem(resource, 1));
    this.resource = resource;
  }

  craft(player: Player) {
    player.inventory.add(new ResourceItem(this.resource, 1), 0);
  }
}
