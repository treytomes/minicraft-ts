export default class Random {
  private static haveNextNextGaussian = false;
  private static nextNextGaussian = 0;

  static nextFloat() {
    return Math.random();
  }

  static nextInt(limit: number) {
    return Math.floor(this.nextFloat() * limit);
  }

  static nextBoolean() {
    if (this.nextFloat() >= 0.5) return true;
    return false;
  }

  static nextGaussian() {
    if (this.haveNextNextGaussian) {
      this.haveNextNextGaussian = false;
      return this.nextNextGaussian;
    } else {
      let s = 9999;
      let v1 = 0;
      let v2 = 0;

      do {
        do {
          v1 = 2.0 * this.nextFloat() - 1.0;
          v2 = 2.0 * this.nextFloat() - 1.0;
          s = v1 * v1 + v2 * v2;
        } while (s >= 1);
      } while (s === 0);

      const multiplier = Math.sqrt((-2 * Math.log(s)) / s);
      this.nextNextGaussian = v2 * multiplier;
      this.haveNextNextGaussian = true;
      return v1 * multiplier;
    }
  }
}
