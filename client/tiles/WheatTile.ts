import {Tile} from '.';
import {Camera} from '../Camera';
import Level from '../Level';
import ToolType from '../ToolType';
import Entity from '../entities/Entity';
import ItemEntity from '../entities/ItemEntity';
import Player from '../entities/Player';
import Item from '../items/Item';
import ResourceItem from '../items/ResourceItem';
import ToolItem from '../items/ToolItem';
import {Resources} from '../resources/Resource';
import {GameTime} from '../system/GameTime';
import {PALETTE, TileSet} from '../system/display';
import Random from '../system/math/Random';
import {Tiles} from './Tile';

// TODO: Generic `PlantTile`?

export default class WheatTile extends Tile {
  constructor() {
    super(PALETTE.get(441)[0]);
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const age = level.getData(x, y);
    let col = PALETTE.get(
      level.dirtColor - 121,
      level.dirtColor - 11,
      level.dirtColor,
      50
    );
    let icon = Math.floor(age / 10);
    if (icon >= 3) {
      col = PALETTE.get(
        level.dirtColor - 121,
        level.dirtColor - 11,
        50 + icon * 100,
        40 + (icon - 3) * 2 * 100
      );
      if (age === 50) {
        col = PALETTE.get(0, 0, 50 + icon * 100, 40 + (icon - 3) * 2 * 100);
      }
      icon = 3;
    }

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    tileset.render({
      pnt: topLeft,
      tileIndex: 4 + 3 * 32 + icon,
      colors: col,
      bits: 0,
    });
    tileset.render({
      pnt: topRight,
      tileIndex: 4 + 3 * 32 + icon,
      colors: col,
      bits: 0,
    });
    tileset.render({
      pnt: bottomLeft,
      tileIndex: 4 + 3 * 32 + icon,
      colors: col,
      bits: 1,
    });
    tileset.render({
      pnt: bottomRight,
      tileIndex: 4 + 3 * 32 + icon,
      colors: col,
      bits: 1,
    });
  }

  // TODO: Rename `tick` to `update`.
  tick(time: GameTime, level: Level, xt: number, yt: number) {
    // TODO: If I use the deltaTime correctly, this Random bit might not be needed.
    // Or maybe the age can be added to with a random variance.
    if (Random.nextInt(2) === 0) return;

    const age = level.getData(xt, yt);
    // TODO: Make sure it doesn't take too long for a tree to grow.
    if (age < 50) level.setData(xt, yt, age + time.deltaTime / 32);
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
      const tool = item as ToolItem;
      if (tool.type === ToolType.shovel) {
        if (player.payStamina(4 - tool.level)) {
          level.setTile(xt, yt, Tiles.dirt, 0);
          return true;
        }
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  steppedOn(level: Level, xt: number, yt: number, entity: Entity) {
    if (Random.nextInt(60) !== 0) return;
    if (level.getData(xt, yt) < 2) return;
    this.harvest(level, xt, yt);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hurtTile(level: Level, x: number, y: number, dmg: number) {
    this.harvest(level, x, y);
  }

  private harvest(level: Level, x: number, y: number) {
    const age = level.getData(x, y);

    let count = Random.nextInt(2);
    for (let i = 0; i < count; i++) {
      level.add(
        new ItemEntity(
          new ResourceItem(Resources.seeds),
          x * 16 + Random.nextInt(10) + 3,
          y * 16 + Random.nextInt(10) + 3
        )
      );
    }

    count = 0;
    if (age === 50) {
      count = Random.nextInt(3) + 2;
    } else if (age >= 40) {
      count = Random.nextInt(2) + 1;
    }
    for (let i = 0; i < count; i++) {
      level.add(
        new ItemEntity(
          new ResourceItem(Resources.wheat),
          x * 16 + Random.nextInt(10) + 3,
          y * 16 + Random.nextInt(10) + 3
        )
      );
    }

    level.setTile(x, y, Tiles.dirt, 0);
  }
}
