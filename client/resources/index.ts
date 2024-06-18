import {PALETTE} from '../system/display';
import PlantableResource from './PlantableResource';
import {Resource, Resources} from './Resource';
import {Tiles} from '../tiles/Tile';
import FoodResource from './FoodResource';

Resources.wood = new Resource(
  'Wood',
  1 + 4 * 32,
  PALETTE.get(-1, 200, 531, 430)
);
Resources.stone = new Resource(
  'Stone',
  2 + 4 * 32,
  PALETTE.get(-1, 111, 333, 555)
);
Resources.wheat = new Resource(
  'Wheat',
  6 + 4 * 32,
  PALETTE.get(-1, 110, 330, 550)
);
Resources.bread = new FoodResource(
  'Bread',
  8 + 4 * 32,
  PALETTE.get(-1, 110, 330, 550),
  2,
  5
);
Resources.apple = new FoodResource(
  'Apple',
  9 + 4 * 32,
  PALETTE.get(-1, 100, 300, 500),
  1,
  5
);

Resources.coal = new Resource(
  'COAL',
  10 + 4 * 32,
  PALETTE.get(-1, 0, 111, 111)
);
Resources.ironOre = new Resource(
  'I.ORE',
  10 + 4 * 32,
  PALETTE.get(-1, 100, 322, 544)
);
Resources.goldOre = new Resource(
  'G.ORE',
  10 + 4 * 32,
  PALETTE.get(-1, 110, 440, 553)
);
Resources.ironIngot = new Resource(
  'IRON',
  11 + 4 * 32,
  PALETTE.get(-1, 100, 322, 544)
);
Resources.goldIngot = new Resource(
  'GOLD',
  11 + 4 * 32,
  PALETTE.get(-1, 110, 330, 553)
);

Resources.slime = new Resource(
  'SLIME',
  10 + 4 * 32,
  PALETTE.get(-1, 10, 30, 50)
);
Resources.glass = new Resource(
  'glass',
  12 + 4 * 32,
  PALETTE.get(-1, 555, 555, 555)
);
Resources.cloth = new Resource(
  'cloth',
  1 + 4 * 32,
  PALETTE.get(-1, 25, 252, 141)
);
Resources.cloud = new PlantableResource(
  'cloud',
  2 + 4 * 32,
  PALETTE.get(-1, 222, 555, 444),
  Tiles.cloud,
  [Tiles.infiniteFall]
);
Resources.gem = new Resource(
  'gem',
  13 + 4 * 32,
  PALETTE.get(-1, 101, 404, 545)
);

export {Resource};
