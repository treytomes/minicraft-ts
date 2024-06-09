import {Tiles, Tile} from './Tile';
import {WaterTile} from './WaterTile';
import {PALETTE} from '../system/display';
import GrassTile from './GrassTile';
import RockTile from './RockTile';
import TreeTile from './TreeTile';
import SandTile from './SandTile';
import StairsTile from './StairsTile';
import OreTile from './OreTile';
import {Resources} from '../resources/Resource';
import PlantableResource from '../resources/PlantableResource';
import DirtTile from './DirtTile';

Tiles.rock = new RockTile();
Tiles.sand = new SandTile();
Tiles.grass = new GrassTile();
Tiles.tree = new TreeTile();
Tiles.stairsDown = new StairsTile(false);
Tiles.ironOre = new OreTile(Resources.ironOre);
Tiles.goldOre = new OreTile(Resources.goldOre);
Tiles.gemOre = new OreTile(Resources.gem);
Tiles.dirt = new DirtTile();
Tiles.cloud = new Tile(PALETTE.get(333)[0]);
Tiles.water = new WaterTile();
Tiles.flower = new Tile(PALETTE.get(414)[0]);
Tiles.cactus = new Tile(PALETTE.get(40)[0]);
Tiles.lava = new Tile(PALETTE.get(511)[0]);
Tiles.infiniteFall = new Tile(PALETTE.get(0)[0]);
Tiles.cloudCactus = new Tile(PALETTE.get(505)[0]);
Tiles.stairsUp = new StairsTile(true);
Tiles.hole = new Tile(PALETTE.get(0)[0]);
Tiles.farmland = new Tile(PALETTE.get(211)[0]);

// These resources need to be explicitly defined after the tiles they use.

Resources.flower = new PlantableResource(
  'Flower',
  0 + 4 * 32,
  PALETTE.get(-1, 10, 444, 330),
  Tiles.flower,
  [Tiles.grass]
);
// TODO: Finish implementing the tile types, then finish implementing the plantable resource types.
// Resources.acorn = new PlantableResource(
//   'Acorn',
//   3 + 4 * 32,
//   PALETTE.get(-1, 100, 531, 320),
//   Tiles.treeSapling,
//   [Tiles.grass]
// );
Resources.dirt = new PlantableResource(
  'Dirt',
  2 + 4 * 32,
  PALETTE.get(-1, 100, 322, 432),
  Tiles.dirt,
  [Tiles.hole, Tiles.water, Tiles.lava]
);
Resources.sand = new PlantableResource(
  'Sand',
  2 + 4 * 32,
  PALETTE.get(-1, 110, 440, 550),
  Tiles.sand,
  [Tiles.grass, Tiles.dirt]
);
// Resources.cactusFlower = new PlantableResource(
//   'Cactus',
//   4 + 4 * 32,
//   PALETTE.get(-1, 10, 40, 50),
//   Tiles.cactusSapling,
//   [Tiles.sand]
// );
// Resources.seeds = new PlantableResource(
//   'Seeds',
//   5 + 4 * 32,
//   PALETTE.get(-1, 10, 40, 50),
//   Tiles.wheat,
//   [Tiles.farmland]
// );

export {Tile};
