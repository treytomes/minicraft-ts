import {Direction} from '../../Direction';
import ToolType from '../../ToolType';
import FurnitureRecipe from '../../crafting/FurnitureRecipe';
import Recipe from '../../crafting/Recipe';
import ToolRecipe from '../../crafting/ToolRecipe';
import {Resources} from '../../resources/Resource';
import {PALETTE} from '../../system/display';
import {Point} from '../../system/math';
import Player from '../Player';
import Anvil from './Anvil';
import Chest from './Chest';
import Furnace from './Furnace';
import Furniture from './Furniture';
import Lantern from './Lantern';
import Oven from './Oven';
import * as events from '../../events';

export default class Workbench extends Furniture {
  constructor() {
    super('Workbench');
    this.col = PALETTE.get(-1, 100, 321, 431);
    this.icon = 4;
    this.size = new Point(6, 4);
  }

  getRecipes(): Recipe[] {
    const recipes: Recipe[] = [];

    recipes.push(
      new FurnitureRecipe(Lantern)
        .addCost(Resources.wood, 5)
        .addCost(Resources.slime, 10)
        .addCost(Resources.glass, 4)
    );

    recipes.push(new FurnitureRecipe(Oven).addCost(Resources.stone, 15));
    recipes.push(new FurnitureRecipe(Furnace).addCost(Resources.stone, 20));
    recipes.push(new FurnitureRecipe(Workbench).addCost(Resources.wood, 20));
    recipes.push(new FurnitureRecipe(Chest).addCost(Resources.wood, 20));
    recipes.push(new FurnitureRecipe(Anvil).addCost(Resources.ironIngot, 5));

    recipes.push(new ToolRecipe(ToolType.sword, 0).addCost(Resources.wood, 5));
    recipes.push(new ToolRecipe(ToolType.axe, 0).addCost(Resources.wood, 5));
    recipes.push(new ToolRecipe(ToolType.hoe, 0).addCost(Resources.wood, 5));
    recipes.push(
      new ToolRecipe(ToolType.pickaxe, 0).addCost(Resources.wood, 5)
    );
    recipes.push(new ToolRecipe(ToolType.shovel, 0).addCost(Resources.wood, 5));
    recipes.push(
      new ToolRecipe(ToolType.sword, 1)
        .addCost(Resources.wood, 5)
        .addCost(Resources.stone, 5)
    );
    recipes.push(
      new ToolRecipe(ToolType.axe, 1)
        .addCost(Resources.wood, 5)
        .addCost(Resources.stone, 5)
    );
    recipes.push(
      new ToolRecipe(ToolType.hoe, 1)
        .addCost(Resources.wood, 5)
        .addCost(Resources.stone, 5)
    );
    recipes.push(
      new ToolRecipe(ToolType.pickaxe, 1)
        .addCost(Resources.wood, 5)
        .addCost(Resources.stone, 5)
    );
    recipes.push(
      new ToolRecipe(ToolType.shovel, 1)
        .addCost(Resources.wood, 5)
        .addCost(Resources.stone, 5)
    );

    return recipes;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUsed(player: Player, attackDir: Direction): boolean {
    window.eventBus.dispatch(events.beginCrafting, this.getRecipes());
    return true;
  }
}
