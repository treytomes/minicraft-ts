import Level from './Level';
import Random from './Random';
import {Tiles} from './tiles/Tile';

const DEFAULT_WIDTH = 128;
const DEFAULT_HEIGHT = 128;

export default class LevelGen {
  public values: Float64Array;

  private w: number;
  private h: number;

  public constructor(w: number, h: number, featureSize: number) {
    this.w = w;
    this.h = h;

    this.values = new Float64Array(w * h);

    for (let y = 0; y < w; y += featureSize) {
      for (let x = 0; x < w; x += featureSize) {
        this.setSample(x, y, Random.nextFloat() * 2 - 1);
      }
    }

    let stepSize = featureSize;
    let scale = 1.0 / w;
    let scaleMod = 1;
    do {
      const halfStep = stepSize / 2;
      for (let y = 0; y < w; y += stepSize) {
        for (let x = 0; x < w; x += stepSize) {
          const a = this.sample(x, y);
          const b = this.sample(x + stepSize, y);
          const c = this.sample(x, y + stepSize);
          const d = this.sample(x + stepSize, y + stepSize);

          const e =
            (a + b + c + d) / 4.0 +
            (Random.nextFloat() * 2 - 1) * stepSize * scale;
          this.setSample(x + halfStep, y + halfStep, e);
        }
      }
      for (let y = 0; y < w; y += stepSize) {
        for (let x = 0; x < w; x += stepSize) {
          const a = this.sample(x, y);
          const b = this.sample(x + stepSize, y);
          const c = this.sample(x, y + stepSize);
          const d = this.sample(x + halfStep, y + halfStep);
          const e = this.sample(x + halfStep, y - halfStep);
          const f = this.sample(x - halfStep, y + halfStep);

          const H =
            (a + b + d + e) / 4.0 +
            (Random.nextFloat() * 2 - 1) * stepSize * scale * 0.5;
          const g =
            (a + c + d + f) / 4.0 +
            (Random.nextFloat() * 2 - 1) * stepSize * scale * 0.5;
          this.setSample(x + halfStep, y, H);
          this.setSample(x, y + halfStep, g);
        }
      }
      stepSize /= 2;
      scale *= scaleMod + 0.8;
      scaleMod *= 0.3;
    } while (stepSize > 1);
  }

  private sample(x: number, y: number): number {
    return this.values[(x & (this.w - 1)) + (y & (this.h - 1)) * this.w];
  }

  private setSample(x: number, y: number, value: number) {
    this.values[(x & (this.w - 1)) + (y & (this.h - 1)) * this.w] = value;
  }

  public static createAndValidateMap(
    depth: number,
    parentLevel?: Level
  ): Level {
    if (depth === 1) {
      return this.generateStairsUp(
        this.createAndValidateSkyMap(DEFAULT_WIDTH, DEFAULT_HEIGHT),
        parentLevel
      );
    } else if (depth === 0) {
      return this.generateStairsUp(
        this.createAndValidateTopMap(DEFAULT_WIDTH, DEFAULT_HEIGHT),
        parentLevel
      );
    } else {
      return this.generateStairsUp(
        this.createAndValidateUndergroundMap(
          DEFAULT_WIDTH,
          DEFAULT_HEIGHT,
          -depth
        ),
        parentLevel
      );
    }
  }

  /**
   * If the new level has a level above it, ensure that you can get back up to the parent level with a nice set of stairs.
   */
  private static generateStairsUp(level: Level, parentLevel?: Level): Level {
    if (!parentLevel) return level;

    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        if (!parentLevel.getTile(x, y).equals(Tiles.stairsDown)) continue;

        level.setTile(x, y, Tiles.stairsUp, 0);
        const wallTile = level.depth === 0 ? Tiles.hardRock : Tiles.dirt;
        level.setTile(x - 1, y - 1, wallTile, 0);
        level.setTile(x + 0, y - 1, wallTile, 0);
        level.setTile(x + 1, y - 1, wallTile, 0);
        level.setTile(x - 1, y + 0, wallTile, 0);
        level.setTile(x + 1, y + 0, wallTile, 0);
        level.setTile(x - 1, y + 1, wallTile, 0);
        level.setTile(x + 0, y + 1, wallTile, 0);
        level.setTile(x + 1, y + 1, wallTile, 0);
      }
    }

    return level;
  }

  public static createAndValidateTopMap(w: number, h: number): Level {
    do {
      const result = this.createTopMap(w, h);

      const count = new Array<number>(256);

      for (let i = 0; i < w * h; i++) {
        count[result[0][i] & 0xff]++;
      }
      if (count[Tiles.rock.id & 0xff] < 100) continue;
      if (count[Tiles.sand.id & 0xff] < 100) continue;
      if (count[Tiles.grass.id & 0xff] < 100) continue;
      if (count[Tiles.tree.id & 0xff] < 100) continue;
      if (count[Tiles.stairsDown.id & 0xff] < 2) continue;

      return new Level({
        depth: 0,
        tileData: result[0],
        metaData: result[1],
      });
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  public static createAndValidateUndergroundMap(
    w: number,
    h: number,
    depth: number
  ): Level {
    do {
      const result = this.createUndergroundMap(w, h, depth);

      const count = new Array<number>(256);

      for (let i = 0; i < w * h; i++) {
        count[result[0][i] & 0xff]++;
      }
      if (count[Tiles.rock.id & 0xff] < 100) continue;
      if (count[Tiles.dirt.id & 0xff] < 100) continue;
      if (count[(Tiles.ironOre.id & 0xff) + depth - 1] < 20) continue;
      if (depth < 3) if (count[Tiles.stairsDown.id & 0xff] < 2) continue;

      return new Level({
        depth: depth,
        tileData: result[0],
        metaData: result[1],
        dirtColor: 444,
      });
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  public static createAndValidateSkyMap(w: number, h: number): Level {
    do {
      const result = this.createSkyMap(w, h);

      const count = new Array<number>(256);

      for (let i = 0; i < w * h; i++) {
        count[result[0][i] & 0xff]++;
      }
      if (count[Tiles.cloud.id & 0xff] < 2000) continue;
      if (count[Tiles.stairsDown.id & 0xff] < 2) continue;

      return new Level({
        depth: 1,
        tileData: result[0],
        metaData: result[1],
        dirtColor: 444,
      });
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  private static createTopMap(w: number, h: number): number[][] {
    const mNoise1 = new LevelGen(w, h, 16);
    const mNoise2 = new LevelGen(w, h, 16);
    const mNoise3 = new LevelGen(w, h, 16);

    const noise1 = new LevelGen(w, h, 32);
    const noise2 = new LevelGen(w, h, 32);

    const map = new Array<number>(w * h);
    const data = new Array<number>(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x + y * w;

        let val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;
        let mVal = Math.abs(mNoise1.values[i] - mNoise2.values[i]);
        mVal = Math.abs(mVal - mNoise3.values[i]) * 3 - 2;

        let xd = (x / (w - 1.0)) * 2 - 1;
        let yd = (y / (h - 1.0)) * 2 - 1;
        if (xd < 0) xd = -xd;
        if (yd < 0) yd = -yd;
        let dist = xd >= yd ? xd : yd;
        dist = dist * dist * dist * dist;
        dist = dist * dist * dist * dist;
        val = val + 1 - dist * 20;

        if (val < -0.5) {
          map[i] = Tiles.water.id;
        } else if (val > 0.5 && mVal < -1.5) {
          map[i] = Tiles.rock.id;
        } else {
          map[i] = Tiles.grass.id;
        }
      }
    }

    for (let i = 0; i < (w * h) / 2800; i++) {
      const xs = Random.nextInt(w);
      const ys = Random.nextInt(h);
      for (let k = 0; k < 10; k++) {
        const x = xs + Random.nextInt(21) - 10;
        const y = ys + Random.nextInt(21) - 10;
        for (let j = 0; j < 100; j++) {
          const xo = x + Random.nextInt(5) - Random.nextInt(5);
          const yo = y + Random.nextInt(5) - Random.nextInt(5);
          for (let yy = yo - 1; yy <= yo + 1; yy++)
            for (let xx = xo - 1; xx <= xo + 1; xx++)
              if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
                if (map[xx + yy * w] === Tiles.grass.id) {
                  map[xx + yy * w] = Tiles.sand.id;
                }
              }
        }
      }
    }

    for (let i = 0; i < (w * h) / 400; i++) {
      const x = Random.nextInt(w);
      const y = Random.nextInt(h);
      for (let j = 0; j < 200; j++) {
        const xx = x + Random.nextInt(15) - Random.nextInt(15);
        const yy = y + Random.nextInt(15) - Random.nextInt(15);
        if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
          if (map[xx + yy * w] === Tiles.grass.id) {
            map[xx + yy * w] = Tiles.tree.id;
          }
        }
      }
    }

    for (let i = 0; i < (w * h) / 400; i++) {
      const x = Random.nextInt(w);
      const y = Random.nextInt(h);
      const col = Random.nextInt(4);
      for (let j = 0; j < 30; j++) {
        const xx = x + Random.nextInt(5) - Random.nextInt(5);
        const yy = y + Random.nextInt(5) - Random.nextInt(5);
        if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
          if (map[xx + yy * w] === Tiles.grass.id) {
            map[xx + yy * w] = Tiles.flower.id;
            data[xx + yy * w] = col + Random.nextInt(4) * 16;
          }
        }
      }
    }

    for (let i = 0; i < (w * h) / 100; i++) {
      const xx = Random.nextInt(w);
      const yy = Random.nextInt(h);
      if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
        if (map[xx + yy * w] === Tiles.sand.id) {
          map[xx + yy * w] = Tiles.cactus.id;
        }
      }
    }

    let count = 0;
    stairsLoop: for (let i = 0; i < (w * h) / 100; i++) {
      const x = Random.nextInt(w - 2) + 1;
      const y = Random.nextInt(h - 2) + 1;

      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 1; xx <= x + 1; xx++) {
          if (map[xx + yy * w] !== Tiles.rock.id) continue stairsLoop;
        }

      map[x + y * w] = Tiles.stairsDown.id;
      count++;
      if (count === 4) break;
    }

    return [map, data];
  }

  private static createUndergroundMap(
    w: number,
    h: number,
    depth: number
  ): number[][] {
    const mNoise1 = new LevelGen(w, h, 16);
    const mNoise2 = new LevelGen(w, h, 16);
    const mNoise3 = new LevelGen(w, h, 16);

    const nNoise1 = new LevelGen(w, h, 16);
    const nNoise2 = new LevelGen(w, h, 16);
    const nNoise3 = new LevelGen(w, h, 16);

    const wNoise = new LevelGen(w, h, 16);

    const noise1 = new LevelGen(w, h, 32);
    const noise2 = new LevelGen(w, h, 32);

    const map = new Array<number>(w * h);
    const data = new Array<number>(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x + y * w;

        let val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;

        let mVal = Math.abs(mNoise1.values[i] - mNoise2.values[i]);
        mVal = Math.abs(mVal - mNoise3.values[i]) * 3 - 2;

        let nVal = Math.abs(nNoise1.values[i] - nNoise2.values[i]);
        nVal = Math.abs(nVal - nNoise3.values[i]) * 3 - 2;

        const wVal = Math.abs(nVal - wNoise.values[i]) * 3 - 2;

        let xd = (x / (w - 1.0)) * 2 - 1;
        let yd = (y / (h - 1.0)) * 2 - 1;
        if (xd < 0) xd = -xd;
        if (yd < 0) yd = -yd;
        let dist = xd >= yd ? xd : yd;
        dist = dist * dist * dist * dist;
        dist = dist * dist * dist * dist;
        val = val + 1 - dist * 20;

        if (val > -2 && wVal < -2.0 + (depth / 2) * 3) {
          if (depth > 2) map[i] = Tiles.lava.id;
          else map[i] = Tiles.water.id;
        } else if (val > -2 && (mVal < -1.7 || nVal < -1.4)) {
          map[i] = Tiles.dirt.id;
        } else {
          map[i] = Tiles.rock.id;
        }
      }
    }

    {
      const r = 2;
      for (let i = 0; i < (w * h) / 400; i++) {
        const x = Random.nextInt(w);
        const y = Random.nextInt(h);
        for (let j = 0; j < 30; j++) {
          const xx = x + Random.nextInt(5) - Random.nextInt(5);
          const yy = y + Random.nextInt(5) - Random.nextInt(5);
          if (xx >= r && yy >= r && xx < w - r && yy < h - r) {
            if (map[xx + yy * w] === Tiles.rock.id) {
              map[xx + yy * w] = (Tiles.ironOre.id & 0xff) + depth - 1;
            }
          }
        }
      }
    }

    if (depth < 3) {
      let count = 0;
      stairsLoop: for (let i = 0; i < (w * h) / 100; i++) {
        const x = Random.nextInt(w - 20) + 10;
        const y = Random.nextInt(h - 20) + 10;

        for (let yy = y - 1; yy <= y + 1; yy++)
          for (let xx = x - 1; xx <= x + 1; xx++) {
            if (map[xx + yy * w] !== Tiles.rock.id) continue stairsLoop;
          }

        map[x + y * w] = Tiles.stairsDown.id;
        count++;
        if (count === 4) break;
      }
    }

    return [map, data];
  }

  private static createSkyMap(w: number, h: number): number[][] {
    const noise1 = new LevelGen(w, h, 8);
    const noise2 = new LevelGen(w, h, 8);

    const map = new Array<number>(w * h);
    const data = new Array<number>(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x + y * w;

        let val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;

        let xd = (x / (w - 1.0)) * 2 - 1;
        let yd = (y / (h - 1.0)) * 2 - 1;
        if (xd < 0) xd = -xd;
        if (yd < 0) yd = -yd;
        let dist = xd >= yd ? xd : yd;
        dist = dist * dist * dist * dist;
        dist = dist * dist * dist * dist;
        val = -val * 1 - 2.2;
        val = val + 1 - dist * 20;

        if (val < -0.25) {
          map[i] = Tiles.infiniteFall.id;
        } else {
          map[i] = Tiles.cloud.id;
        }
      }
    }

    stairsLoop: for (let i = 0; i < (w * h) / 50; i++) {
      const x = Random.nextInt(w - 2) + 1;
      const y = Random.nextInt(h - 2) + 1;

      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 1; xx <= x + 1; xx++) {
          if (map[xx + yy * w] !== Tiles.cloud.id) continue stairsLoop;
        }

      map[x + y * w] = Tiles.cloudCactus.id;
    }

    let count = 0;
    stairsLoop: for (let i = 0; i < w * h; i++) {
      const x = Random.nextInt(w - 2) + 1;
      const y = Random.nextInt(h - 2) + 1;

      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 1; xx <= x + 1; xx++) {
          if (map[xx + yy * w] !== Tiles.cloud.id) continue stairsLoop;
        }

      map[x + y * w] = Tiles.stairsDown.id;
      count++;
      if (count === 2) break;
    }

    return [map, data];
  }
}
