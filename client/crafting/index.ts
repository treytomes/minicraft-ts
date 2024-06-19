import ToolType from '../ToolType';
import Anvil from '../entities/furniture/Anvil';
import Chest from '../entities/furniture/Chest';
import Furnace from '../entities/furniture/Furnace';
import Lantern from '../entities/furniture/Lantern';
import Oven from '../entities/furniture/Oven';
import Workbench from '../entities/furniture/Workbench';
import {Resources} from '../resources/Resource';
import FurnitureRecipe from './FurnitureRecipe';
import Recipe from './Recipe';
import ResourceRecipe from './ResourceRecipe';
import ToolRecipe from './ToolRecipe';

export const anvilRecipes: Recipe[] = [];
export const ovenRecipes: Recipe[] = [];
export const furnaceRecipes: Recipe[] = [];
export const workbenchRecipes: Recipe[] = [];

// TODO: I think I would rather load all of this from a data file.

workbenchRecipes.push(
  new FurnitureRecipe(Lantern)
    .addCost(Resources.wood, 5)
    .addCost(Resources.slime, 10)
    .addCost(Resources.glass, 4)
);

workbenchRecipes.push(new FurnitureRecipe(Oven).addCost(Resources.stone, 15));
workbenchRecipes.push(
  new FurnitureRecipe(Furnace).addCost(Resources.stone, 20)
);
workbenchRecipes.push(
  new FurnitureRecipe(Workbench).addCost(Resources.wood, 20)
);
workbenchRecipes.push(new FurnitureRecipe(Chest).addCost(Resources.wood, 20));
workbenchRecipes.push(
  new FurnitureRecipe(Anvil).addCost(Resources.ironIngot, 5)
);

workbenchRecipes.push(
  new ToolRecipe(ToolType.sword, 0).addCost(Resources.wood, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.axe, 0).addCost(Resources.wood, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.hoe, 0).addCost(Resources.wood, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.pickaxe, 0).addCost(Resources.wood, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.shovel, 0).addCost(Resources.wood, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.sword, 1)
    .addCost(Resources.wood, 5)
    .addCost(Resources.stone, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.axe, 1)
    .addCost(Resources.wood, 5)
    .addCost(Resources.stone, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.hoe, 1)
    .addCost(Resources.wood, 5)
    .addCost(Resources.stone, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.pickaxe, 1)
    .addCost(Resources.wood, 5)
    .addCost(Resources.stone, 5)
);
workbenchRecipes.push(
  new ToolRecipe(ToolType.shovel, 1)
    .addCost(Resources.wood, 5)
    .addCost(Resources.stone, 5)
);

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
