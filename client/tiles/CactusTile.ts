import {Camera} from '../Camera';
import Level from '../Level';
import Entity from '../entities/Entity';
import ItemEntity from '../entities/ItemEntity';
import Mob from '../entities/Mob';
import {SmashParticle, TextParticle} from '../entities/particles';
import ResourceItem from '../items/ResourceItem';
import {Resources} from '../resources/Resource';
import {GameTime} from '../system/GameTime';
import {PALETTE, TileSet} from '../system/display';
import Random from '../system/math/Random';
import {Tile, Tiles} from './Tile';

export default class CactusTile extends Tile {
  constructor() {
    super(PALETTE.get(40)[0]);
    this.connectsToSand = true;
  }

  render(tileset: TileSet, level: Level, x: number, y: number, camera: Camera) {
    const colors = PALETTE.get(20, 40, 50, level.sandColor);

    const topLeft = camera.translate(x, y);
    const topRight = camera.translate(x + tileset.tileWidth, y);
    const bottomLeft = camera.translate(x, y + tileset.tileHeight);
    const bottomRight = camera.translate(
      x + tileset.tileWidth,
      y + tileset.tileHeight
    );

    tileset.render({pnt: topLeft, tileIndex: 8 + 2 * 32, colors});
    tileset.render({pnt: topRight, tileIndex: 9 + 2 * 32, colors});
    tileset.render({pnt: bottomLeft, tileIndex: 8 + 3 * 32, colors});
    tileset.render({pnt: bottomRight, tileIndex: 9 + 3 * 32, colors});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mayPass(level: Level, x: number, y: number, e: Entity) {
    return false;
  }

  protected hurtMob(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    level: Level,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    x: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    y: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    source: Mob,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dmg: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attackDir: number
  ) {
    const damage = level.getData(x, y) + dmg;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(
      new TextParticle(
        '' + dmg,
        x * 16 + 8,
        y * 16 + 8,
        PALETTE.get(-1, 500, 500, 500)
      )
    );
    if (damage >= 10) {
      const count = Random.nextInt(2) + 1;
      for (let i = 0; i < count; i++) {
        level.add(
          new ItemEntity(
            new ResourceItem(Resources.cactusFlower),
            x * 16 + Random.nextInt(10) + 3,
            y * 16 + Random.nextInt(10) + 3
          )
        );
      }
      level.setTile(x, y, Tiles.sand, 0);
    } else {
      level.setData(x, y, damage);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bumpedInto(level: Level, x: number, y: number, entity: Entity) {
    entity.hurt(this, x, y, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(time: GameTime, level: Level, xt: number, yt: number) {
    const damage = level.getData(xt, yt);
    if (damage > 0) level.setData(xt, yt, damage - time.deltaTime / 32);
  }
}
