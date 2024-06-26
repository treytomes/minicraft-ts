import {Camera} from '../Camera';
import {Direction} from '../Direction';
import Level from '../Level';
import ToolType from '../ToolType';
import ItemEntity from '../entities/ItemEntity';
import Player from '../entities/Player';
import Item from '../items/Item';
import ResourceItem from '../items/ResourceItem';
import ToolItem from '../items/ToolItem';
import {Resources} from '../resources/Resource';
import {Sound} from '../system/audio/Sound';
import {PALETTE, TileSet} from '../system/display';
import Random from '../system/math/Random';
import {Tile, Tiles} from './Tile';
import * as sounds from '../sounds';

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
    attackDir: Direction
  ): boolean {
    if (item instanceof ToolItem) {
      const tool = item as ToolItem;
      if (tool.type === ToolType.shovel) {
        if (player.payStamina(4 - tool.level)) {
          level.setTile(xt, yt, Tiles.hole, 0);
          level.add(
            new ItemEntity(
              new ResourceItem(Resources.dirt),
              xt * 16 + Random.nextInt(10) + 3,
              yt * 16 + Random.nextInt(10) + 3
            )
          );
          sounds.monsterhurt.play();
          return true;
        }
      }
      if (tool.type === ToolType.hoe) {
        if (player.payStamina(4 - tool.level)) {
          level.setTile(xt, yt, Tiles.farmland, 0);
          sounds.monsterhurt.play();
          return true;
        }
      }
    }
    return false;
  }
}
