import Level from '../Level';
import Random from '../system/math/Random';
import {Point} from '../system/math';
import {Tile, Tiles} from '../tiles/Tile';
import Player from './Player';

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

  static spawnPlayer(level: Level): Player {
    const spawnPoint = this.findSpawnPoint(level);
    return new Player(spawnPoint.x, spawnPoint.y);
  }
}
