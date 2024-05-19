import Random from './Random';

export enum TileIDs {
  rock = 0,
  sand = 1,
  grass = 2,
  tree = 3,
  stairsDown = 4,
  ironOre = 5,
  goldOre = 6,
  gemOre = 7,
  dirt = 8,
  cloud = 9,
  water = 10,
  flower = 11,
  cactus = 12,
  lava = 13,
  infiniteFall = 14,
  cloudCactus = 15,
  stairsUp = 16,
}

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

  public static createAndValidateTopMap(w: number, h: number): number[][] {
    do {
      const result = this.createTopMap(w, h);

      const count = new Array<number>(256);

      for (let i = 0; i < w * h; i++) {
        count[result[0][i] & 0xff]++;
      }
      if (count[TileIDs.rock & 0xff] < 100) continue;
      if (count[TileIDs.sand & 0xff] < 100) continue;
      if (count[TileIDs.grass & 0xff] < 100) continue;
      if (count[TileIDs.tree & 0xff] < 100) continue;
      if (count[TileIDs.stairsDown & 0xff] < 2) continue;

      return result;
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  public static createAndValidateUndergroundMap(
    w: number,
    h: number,
    depth: number
  ): number[][] {
    do {
      const result = this.createUndergroundMap(w, h, depth);

      const count = new Array<number>(256);

      for (let i = 0; i < w * h; i++) {
        count[result[0][i] & 0xff]++;
      }
      if (count[TileIDs.rock & 0xff] < 100) continue;
      if (count[TileIDs.dirt & 0xff] < 100) continue;
      if (count[(TileIDs.ironOre & 0xff) + depth - 1] < 20) continue;
      if (depth < 3) if (count[TileIDs.stairsDown & 0xff] < 2) continue;

      return result;
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  public static createAndValidateSkyMap(w: number, h: number): number[][] {
    do {
      const result = this.createSkyMap(w, h);

      const count = new Array<number>(256);

      for (let i = 0; i < w * h; i++) {
        count[result[0][i] & 0xff]++;
      }
      if (count[TileIDs.cloud & 0xff] < 2000) continue;
      if (count[TileIDs.stairsDown & 0xff] < 2) continue;

      return result;
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  private static createTopMap(w: number, h: number): number[][] {
    const mnoise1 = new LevelGen(w, h, 16);
    const mnoise2 = new LevelGen(w, h, 16);
    const mnoise3 = new LevelGen(w, h, 16);

    const noise1 = new LevelGen(w, h, 32);
    const noise2 = new LevelGen(w, h, 32);

    const map = new Array<number>(w * h);
    const data = new Array<number>(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x + y * w;

        let val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;
        let mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
        mval = Math.abs(mval - mnoise3.values[i]) * 3 - 2;

        let xd = (x / (w - 1.0)) * 2 - 1;
        let yd = (y / (h - 1.0)) * 2 - 1;
        if (xd < 0) xd = -xd;
        if (yd < 0) yd = -yd;
        let dist = xd >= yd ? xd : yd;
        dist = dist * dist * dist * dist;
        dist = dist * dist * dist * dist;
        val = val + 1 - dist * 20;

        if (val < -0.5) {
          map[i] = TileIDs.water;
        } else if (val > 0.5 && mval < -1.5) {
          map[i] = TileIDs.rock;
        } else {
          map[i] = TileIDs.grass;
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
                if (map[xx + yy * w] === TileIDs.grass) {
                  map[xx + yy * w] = TileIDs.sand;
                }
              }
        }
      }
    }

    /*
     * for (int i = 0; i < w * h / 2800; i++) { int xs = random.nextInt(w); int ys = random.nextInt(h); for (int k = 0; k < 10; k++) { int x = xs + random.nextInt(21) - 10; int y = ys + random.nextInt(21) - 10; for (int j = 0; j < 100; j++) { int xo = x + random.nextInt(5) - random.nextInt(5); int yo = y + random.nextInt(5) - random.nextInt(5); for (int yy = yo - 1; yy <= yo + 1; yy++) for (int xx = xo - 1; xx <= xo + 1; xx++) if (xx >= 0 && yy >= 0 && xx < w && yy < h) { if (map[xx + yy * w] == Tile.grass.id) { map[xx + yy * w] = Tile.dirt.id; } } } } }
     */

    for (let i = 0; i < (w * h) / 400; i++) {
      const x = Random.nextInt(w);
      const y = Random.nextInt(h);
      for (let j = 0; j < 200; j++) {
        const xx = x + Random.nextInt(15) - Random.nextInt(15);
        const yy = y + Random.nextInt(15) - Random.nextInt(15);
        if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
          if (map[xx + yy * w] === TileIDs.grass) {
            map[xx + yy * w] = TileIDs.tree;
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
          if (map[xx + yy * w] === TileIDs.grass) {
            map[xx + yy * w] = TileIDs.flower;
            data[xx + yy * w] = col + Random.nextInt(4) * 16;
          }
        }
      }
    }

    for (let i = 0; i < (w * h) / 100; i++) {
      const xx = Random.nextInt(w);
      const yy = Random.nextInt(h);
      if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
        if (map[xx + yy * w] === TileIDs.sand) {
          map[xx + yy * w] = TileIDs.cactus;
        }
      }
    }

    let count = 0;
    stairsLoop: for (let i = 0; i < (w * h) / 100; i++) {
      const x = Random.nextInt(w - 2) + 1;
      const y = Random.nextInt(h - 2) + 1;

      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 1; xx <= x + 1; xx++) {
          if (map[xx + yy * w] !== TileIDs.rock) continue stairsLoop;
        }

      map[x + y * w] = TileIDs.stairsDown;
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
    const mnoise1 = new LevelGen(w, h, 16);
    const mnoise2 = new LevelGen(w, h, 16);
    const mnoise3 = new LevelGen(w, h, 16);

    const nnoise1 = new LevelGen(w, h, 16);
    const nnoise2 = new LevelGen(w, h, 16);
    const nnoise3 = new LevelGen(w, h, 16);

    const wnoise1 = new LevelGen(w, h, 16);
    const wnoise2 = new LevelGen(w, h, 16);
    const wnoise3 = new LevelGen(w, h, 16);

    const noise1 = new LevelGen(w, h, 32);
    const noise2 = new LevelGen(w, h, 32);

    const map = new Array<number>(w * h);
    const data = new Array<number>(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x + y * w;

        let val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;

        let mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
        mval = Math.abs(mval - mnoise3.values[i]) * 3 - 2;

        let nval = Math.abs(nnoise1.values[i] - nnoise2.values[i]);
        nval = Math.abs(nval - nnoise3.values[i]) * 3 - 2;

        let wval = Math.abs(wnoise1.values[i] - wnoise2.values[i]);
        wval = Math.abs(nval - wnoise3.values[i]) * 3 - 2;

        let xd = (x / (w - 1.0)) * 2 - 1;
        let yd = (y / (h - 1.0)) * 2 - 1;
        if (xd < 0) xd = -xd;
        if (yd < 0) yd = -yd;
        let dist = xd >= yd ? xd : yd;
        dist = dist * dist * dist * dist;
        dist = dist * dist * dist * dist;
        val = val + 1 - dist * 20;

        if (val > -2 && wval < -2.0 + (depth / 2) * 3) {
          if (depth > 2) map[i] = TileIDs.lava;
          else map[i] = TileIDs.water;
        } else if (val > -2 && (mval < -1.7 || nval < -1.4)) {
          map[i] = TileIDs.dirt;
        } else {
          map[i] = TileIDs.rock;
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
            if (map[xx + yy * w] === TileIDs.rock) {
              map[xx + yy * w] = (TileIDs.ironOre & 0xff) + depth - 1;
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
            if (map[xx + yy * w] !== TileIDs.rock) continue stairsLoop;
          }

        map[x + y * w] = TileIDs.stairsDown;
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
          map[i] = TileIDs.infiniteFall;
        } else {
          map[i] = TileIDs.cloud;
        }
      }
    }

    stairsLoop: for (let i = 0; i < (w * h) / 50; i++) {
      const x = Random.nextInt(w - 2) + 1;
      const y = Random.nextInt(h - 2) + 1;

      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 1; xx <= x + 1; xx++) {
          if (map[xx + yy * w] !== TileIDs.cloud) continue stairsLoop;
        }

      map[x + y * w] = TileIDs.cloudCactus;
    }

    let count = 0;
    stairsLoop: for (let i = 0; i < w * h; i++) {
      const x = Random.nextInt(w - 2) + 1;
      const y = Random.nextInt(h - 2) + 1;

      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 1; xx <= x + 1; xx++) {
          if (map[xx + yy * w] !== TileIDs.cloud) continue stairsLoop;
        }

      map[x + y * w] = TileIDs.stairsDown;
      count++;
      if (count === 2) break;
    }

    return [map, data];
  }
}
