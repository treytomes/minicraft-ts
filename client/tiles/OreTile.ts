import {Camera} from '../Camera';
import Level from '../Level';
import ToolType from '../ToolType';
import Entity from '../entities/Entity';
import ItemEntity from '../entities/ItemEntity';
import Player from '../entities/Player';
import {SmashParticle, TextParticle} from '../entities/particles';
import Item from '../items/Item';
import ResourceItem from '../items/ResourceItem';
import ToolItem from '../items/ToolItem';
import {Resource} from '../resources/Resource';
import {PALETTE, TileSet} from '../system/display';
import Random from '../system/math/Random';
import {Tile, Tiles} from './Tile';

export default class OreTile extends Tile {
  private toDrop: Resource;

  constructor(toDrop: Resource) {
    super(toDrop.color[1]);
    this.toDrop = toDrop;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const color = [
      PALETTE.get(level.dirtColor)[0],
      this.toDrop.color[1],
      this.toDrop.color[2],
      this.toDrop.color[3],
    ];

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    tileset.render({pnt: topLeft, tileIndex: 17 + 1 * 32, colors: color});
    tileset.render({pnt: topRight, tileIndex: 18 + 1 * 32, colors: color});
    tileset.render({pnt: bottomLeft, tileIndex: 17 + 2 * 32, colors: color});
    tileset.render({pnt: bottomRight, tileIndex: 18 + 2 * 32, colors: color});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    return false;
  }

  interact(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    yt: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: Player,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    item: Item,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: number
  ): boolean {
    if (item instanceof ToolItem) {
      const tool = item as ToolItem;
      if (tool.type === ToolType.pickaxe) {
        if (player.payStamina(6 - tool.level)) {
          this.hurt(level, xt, yt, 1);
          return true;
        }
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hurtTile(level: Level, x: number, y: number, dmg: number) {
    const damage = level.getData(x, y) + 1;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(
      new TextParticle(
        '' + dmg,
        x * 16 + 8,
        y * 16 + 8,
        PALETTE.get(-1, 500, 500, 500)
      )
    );
    if (dmg > 0) {
      let count = Random.nextInt(2);
      if (damage >= Random.nextInt(10) + 3) {
        level.setTile(x, y, Tiles.dirt, 0);
        count += 2;
      } else {
        level.setData(x, y, damage);
      }
      for (let i = 0; i < count; i++) {
        level.add(
          new ItemEntity(
            new ResourceItem(this.toDrop),
            x * 16 + Random.nextInt(10) + 3,
            y * 16 + Random.nextInt(10) + 3
          )
        );
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bumpedInto(level: Level, x: number, y: number, entity: Entity) {
    entity.hurt(level, this, x, y, 3);
  }
}
