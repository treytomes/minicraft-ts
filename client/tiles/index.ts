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
import CloudTile from './CloudTile';
import FlowerTile from './FlowerTile';
import CactusTile from './CactusTile';
import LavaTile from './LavaTile';
import InfiniteFallTile from './InfiniteFallTile';
import CloudCactusTile from './CloudCactusTile';
import HoleTile from './HoleTile';
import FarmTile from './FarmTile';
import HardRockTile from './HardRockTile';
import {SaplingTile} from './SaplingTile';
import WheatTile from './WheatTile';

// TODO: I've given it some though, and these tiles need well-defined id numbers.

Tiles.grass = new GrassTile();
Tiles.rock = new RockTile();
Tiles.water = new WaterTile();
Tiles.flower = new FlowerTile();
Tiles.tree = new TreeTile();
Tiles.dirt = new DirtTile();
Tiles.sand = new SandTile();
Tiles.cactus = new CactusTile();
Tiles.hole = new HoleTile();
Tiles.treeSapling = new SaplingTile(Tiles.grass, Tiles.tree);
Tiles.cactusSapling = new SaplingTile(Tiles.sand, Tiles.cactus);
Tiles.farmland = new FarmTile();
Tiles.wheat = new WheatTile();
Tiles.lava = new LavaTile();
Tiles.stairsDown = new StairsTile(false);
Tiles.stairsUp = new StairsTile(true);
Tiles.infiniteFall = new InfiniteFallTile();
Tiles.cloud = new CloudTile();
Tiles.hardRock = new HardRockTile();
Tiles.ironOre = new OreTile(Resources.ironOre);
Tiles.goldOre = new OreTile(Resources.goldOre);
Tiles.gemOre = new OreTile(Resources.gem);
Tiles.cloudCactus = new CloudCactusTile();

// These resources need to be explicitly defined after the tiles they use.

Resources.flower = new PlantableResource(
  'Flower',
  0 + 4 * 32,
  PALETTE.get(-1, 10, 444, 330),
  Tiles.flower,
  [Tiles.grass]
);

Resources.acorn = new PlantableResource(
  'Acorn',
  3 + 4 * 32,
  PALETTE.get(-1, 100, 531, 320),
  Tiles.treeSapling,
  [Tiles.grass]
);
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
Resources.cactusFlower = new PlantableResource(
  'Cactus',
  4 + 4 * 32,
  PALETTE.get(-1, 10, 40, 50),
  Tiles.cactusSapling,
  [Tiles.sand]
);
Resources.seeds = new PlantableResource(
  'Seeds',
  5 + 4 * 32,
  PALETTE.get(-1, 10, 40, 50),
  Tiles.wheat,
  [Tiles.farmland]
);

export {Tile};
