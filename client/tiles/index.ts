import {tiles, Tile} from './Tile';
import {WaterTile} from './WaterTile';
import {PALETTE} from '../system/display';
import GrassTile from './GrassTile';
import RockTile from './RockTile';
import TreeTile from './TreeTile';
import SandTile from './SandTile';
import StairsTile from './StairsTile';

export const getById = (tileId: number) => tiles[tileId];

export const rock = new RockTile();
export const sand = new SandTile();
export const grass = new GrassTile();
export const tree = new TreeTile();
export const stairsDown = new StairsTile(false);
export const ironOre = new Tile(PALETTE.get(550)[0]);
export const goldOre = new Tile(PALETTE.get(550)[0]);
export const gemOre = new Tile(PALETTE.get(550)[0]);
export const dirt = new Tile(PALETTE.get(211)[0]);
export const cloud = new Tile(PALETTE.get(333)[0]);
export const water = new WaterTile();
export const flower = new Tile(PALETTE.get(414)[0]);
export const cactus = new Tile(PALETTE.get(40)[0]);
export const lava = new Tile(PALETTE.get(511)[0]);
export const infiniteFall = new Tile(PALETTE.get(0)[0]);
export const cloudCactus = new Tile(PALETTE.get(505)[0]);
export const stairsUp = new StairsTile(true);
export const hole = new Tile(PALETTE.get(0)[0]);
export const farmland = new Tile(PALETTE.get(211)[0]);
