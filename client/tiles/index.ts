import {tiles, Tile} from './Tile';
export * as Tile from './Tile';
import {WaterTile} from './WaterTile';
import {Color} from '../system/display';

export const getById = (tileId: number) => tiles[tileId];

export const rock = new Tile(new Color(0xa0, 0xa0, 0xa0));
export const sand = new Tile(new Color(0xa0, 0xa0, 0x40));
export const grass = new Tile(new Color(0x20, 0x80, 0x20));
export const tree = new Tile(new Color(0x00, 0x30, 0x00));
export const stairsDown = new Tile(new Color(0xff, 0xff, 0xff));
export const ironOre = new Tile(new Color(0xff, 0xff, 0));
export const goldOre = new Tile(new Color(0xff, 0xff, 0));
export const gemOre = new Tile(new Color(0xff, 0xff, 0));
export const dirt = new Tile(new Color(0x60, 0x40, 0x40));
export const cloud = new Tile(new Color(0xa0, 0xa0, 0xa0));
export const water = new WaterTile();
export const flower = new Tile(new Color(0xee, 0x22, 0xee));
export const cactus = new Tile(new Color(0, 0xee, 0));
export const lava = new Tile(new Color(0xff, 0x20, 0x20));
export const infiniteFall = new Tile(new Color(0, 0, 0));
export const cloudCactus = new Tile(new Color(0xff, 0x00, 0xff));
export const stairsUp = new Tile(new Color(0xff, 0xff, 0xff));
