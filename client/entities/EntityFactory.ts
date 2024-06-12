import Level from '../Level';
import Random from '../system/math/Random';
import {Point} from '../system/math';
import {Tile, Tiles} from '../tiles/Tile';
import Player from './Player';
import World from '../World';

export default class EntityFactory {
  private static findSpawnPoint(level: Level): Point {
    let spawnPoint: Point | undefined = undefined;

    while (!spawnPoint) {
      const x = Random.nextInt(level.width);
      const y = Random.nextInt(level.height);
      if (!level.getTile(x, y).equals(Tiles.grass)) continue;

      spawnPoint = new Point(
        x * Tile.width + Tile.width / 2,
        y * Tile.height + Tile.height / 2
      );
    }

    return spawnPoint;
  }

  static spawnPlayer(world: World): Player {
    const spawnPoint = this.findSpawnPoint(world.currentLevel);
    world.player = new Player(spawnPoint.x, spawnPoint.y);
    world.currentLevel.add(world.player);
    return world.player;
  }
}
