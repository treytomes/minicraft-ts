import ToolType from '../ToolType';
import {Resources} from '../resources/Resource';
import Recipe from './Recipe';
import ResourceRecipe from './ResourceRecipe';
import ToolRecipe from './ToolRecipe';

export const anvilRecipes: Recipe[] = [];
export const ovenRecipes: Recipe[] = [];
export const furnaceRecipes: Recipe[] = [];

// TODO: I think I would rather load all of this from a data file.

// TODO: Moved workbench recipes to the Workbench class.

anvilRecipes.push(
  new ToolRecipe(ToolType.sword, 2)
    .addCost(Resources.wood, 5)
    .addCost(Resources.ironIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.axe, 2)
    .addCost(Resources.wood, 5)
    .addCost(Resources.ironIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.hoe, 2)
    .addCost(Resources.wood, 5)
    .addCost(Resources.ironIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.pickaxe, 2)
    .addCost(Resources.wood, 5)
    .addCost(Resources.ironIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.shovel, 2)
    .addCost(Resources.wood, 5)
    .addCost(Resources.ironIngot, 5)
);

anvilRecipes.push(
  new ToolRecipe(ToolType.sword, 3)
    .addCost(Resources.wood, 5)
    .addCost(Resources.goldIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.axe, 3)
    .addCost(Resources.wood, 5)
    .addCost(Resources.goldIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.hoe, 3)
    .addCost(Resources.wood, 5)
    .addCost(Resources.goldIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.pickaxe, 3)
    .addCost(Resources.wood, 5)
    .addCost(Resources.goldIngot, 5)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.shovel, 3)
    .addCost(Resources.wood, 5)
    .addCost(Resources.goldIngot, 5)
);

anvilRecipes.push(
  new ToolRecipe(ToolType.sword, 4)
    .addCost(Resources.wood, 5)
    .addCost(Resources.gem, 50)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.axe, 4)
    .addCost(Resources.wood, 5)
    .addCost(Resources.gem, 50)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.hoe, 4)
    .addCost(Resources.wood, 5)
    .addCost(Resources.gem, 50)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.pickaxe, 4)
    .addCost(Resources.wood, 5)
    .addCost(Resources.gem, 50)
);
anvilRecipes.push(
  new ToolRecipe(ToolType.shovel, 4)
    .addCost(Resources.wood, 5)
    .addCost(Resources.gem, 50)
);

furnaceRecipes.push(
  new ResourceRecipe(Resources.ironIngot)
    .addCost(Resources.ironOre, 4)
    .addCost(Resources.coal, 1)
);
furnaceRecipes.push(
  new ResourceRecipe(Resources.goldIngot)
    .addCost(Resources.goldOre, 4)
    .addCost(Resources.coal, 1)
);
furnaceRecipes.push(
  new ResourceRecipe(Resources.glass)
    .addCost(Resources.sand, 4)
    .addCost(Resources.coal, 1)
);

ovenRecipes.push(
  new ResourceRecipe(Resources.bread).addCost(Resources.wheat, 4)
);
