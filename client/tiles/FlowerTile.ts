import {Camera} from '../Camera';
import Level from '../Level';
import ToolType from '../ToolType';
import Player from '../entities/Player';
import Item from '../items/Item';
import ToolItem from '../items/ToolItem';
import {PALETTE, TileSet} from '../system/display';
import GrassTile from './GrassTile';
import {Tile} from './Tile';

export default class FlowerTile extends GrassTile {
  constructor() {
    super(PALETTE.get(414)[0]);
    this.connectsToGrass = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    super.render(tileset, level, x, y, camera);

    const tx = Math.floor(x / Tile.width);
    const ty = Math.floor(y / Tile.height);

    const data = level.getData(tx, ty);
    const shape = (data / 16) % 2;
    const flowerCol = PALETTE.get(10, level.grassColor, 555, 440);

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    // console.log(shape);
    if (shape === 0) {
      tileset.render({pnt: topLeft, tileIndex: 1 + 1 * 32, colors: flowerCol});
    }
    if (shape === 1) {
      tileset.render({pnt: topRight, tileIndex: 1 + 1 * 32, colors: flowerCol});
    }
    if (shape === 1) {
      tileset.render({
        pnt: bottomLeft,
        tileIndex: 1 + 1 * 32,
        colors: flowerCol,
      });
    }
    if (shape === 0) {
      tileset.render({
        pnt: bottomRight,
        tileIndex: 1 + 1 * 32,
        colors: flowerCol,
      });
    }
  }

  interact(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    yt: number,
    player: Player,
    item: Item,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: number
  ): boolean {
    if (item instanceof ToolItem) {
      const tool = item as ToolItem;
      if (tool.type === ToolType.shovel) {
        if (player.payStamina(4 - tool.level)) {
          // TODO: Finish implementing FlowerTile.interact
          // level.add(new ItemEntity(new ResourceItem(Resources.flower), x * 16 + Random.nextInt(10) + 3, y * 16 + Random.nextInt(10) + 3));
          // level.add(new ItemEntity(new ResourceItem(Resources.flower), x * 16 + Random.nextInt(10) + 3, y * 16 + Random.nextInt(10) + 3));
          // level.setTile(x, y, Tiles.grass, 0);
          return true;
        }
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hurtTile(level: Level, x: number, y: number, dmg: number) {
    // TODO: Finish implementing FlowerTile.hurtTile.
    // const count = Random.nextInt(2) + 1;
    // for (int i = 0; i < count; i++) {
    // 	level.add(new ItemEntity(new ResourceItem(Resources.flower), x * 16 + Random.nextInt(10) + 3, y * 16 + Random.nextInt(10) + 3));
    // }
    // level.setTile(x, y, Tiles.grass, 0);
  }
}
