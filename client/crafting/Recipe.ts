import Player from '../entities/Player';
import Item from '../items/Item';
import ResourceItem from '../items/ResourceItem';
import {Resource} from '../resources';
import {Font, PALETTE, TileSet} from '../system/display';
import IListableItem from '../ui/IListableItem';

export default abstract class Recipe implements IListableItem {
  costs: Item[] = [];
  canCraft = false;
  resultTemplate: Item;
  private font!: Font;

  constructor(resultTemplate: Item) {
    this.resultTemplate = resultTemplate;
    window.resources.load(Font, 'font.json').then(font => (this.font = font));
  }

  addCost(resource: Resource, count: number): Recipe {
    this.costs.push(new ResourceItem(resource, count));
    return this;
  }

  checkCanCraft(player: Player) {
    for (let i = 0; i < this.costs.length; i++) {
      const item = this.costs[i];
      if (item instanceof ResourceItem) {
        const ri = item as ResourceItem;
        if (!player.inventory.hasResources(ri.resource, ri.count)) {
          this.canCraft = false;
          return;
        }
      }
    }
    this.canCraft = true;
  }

  renderInventory(tileset: TileSet, x: number, y: number) {
    tileset.render({
      x,
      y,
      tileIndex: this.resultTemplate.icon,
      colors: this.resultTemplate.color,
    });
    const textColor = this.canCraft
      ? PALETTE.get(-1, 555, 555, 555)
      : PALETTE.get(-1, 222, 222, 222);
    this.font?.render(this.resultTemplate.name, x + 8, y, textColor);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  craft(player: Player) {}

  deductCost(player: Player) {
    for (let i = 0; i < this.costs.length; i++) {
      const item = this.costs[i];
      if (item instanceof ResourceItem) {
        const ri = item as ResourceItem;
        player.inventory.removeResource(ri.resource, ri.count);
      }
    }
  }
}
