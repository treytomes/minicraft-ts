import {Camera} from '../Camera';
import Level from '../Level';
import Player from '../entities/Player';
import Item from '../items/Item';
import ToolItem from '../items/ToolItem';
import {PALETTE, TileSet} from '../system/display';
import {Tile} from './Tile';

export default class DirtTile extends Tile {
  constructor() {
    super(PALETTE.get(211)[0]);
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const col = PALETTE.get(
      level.dirtColor,
      level.dirtColor,
      level.dirtColor - 111,
      level.dirtColor - 111
    );

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    tileset.render({pnt: topLeft, tileIndex: 0, colors: col});
    tileset.render({pnt: topRight, tileIndex: 1, colors: col});
    tileset.render({pnt: bottomLeft, tileIndex: 2, colors: col});
    tileset.render({pnt: bottomRight, tileIndex: 3, colors: col});
  }

  interact(
    level: Level,
    xt: number,
    yt: number,
    player: Player,
    item: Item,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: number
  ): boolean {
    if (item instanceof ToolItem) {
      // TODO: Finish implementing DirtTile.interact.
      // const tool = item as ToolItem;
      // if (tool.type === ToolType.shovel) {
      // 	if (player.payStamina(4 - tool.level)) {
      // 		level.setTile(xt, yt, Tiles.hole, 0);
      // 		level.add(new ItemEntity(new ResourceItem(Resource.dirt), xt * 16 + Random.nextInt(10) + 3, yt * 16 + Random.nextInt(10) + 3));
      // 		Sound.monsterHurt.play();
      // 		return true;
      // 	}
      // }
      // if (tool.type === ToolType.hoe) {
      // 	if (player.payStamina(4 - tool.level)) {
      // 		level.setTile(xt, yt, Tile.farmland, 0);
      // 		Sound.monsterHurt.play();
      // 		return true;
      // 	}
      // }
    }
    return false;
  }
}
