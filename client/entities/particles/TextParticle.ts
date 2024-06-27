import {Camera} from '../../Camera';
import {GameTime} from '../../system/GameTime';
import {Color, Font, PALETTE, TileSet} from '../../system/display';
import Random from '../../system/math/Random';
import Particle from './Particle';

export default class TextParticle extends Particle {
  private msg: string;
  private col: Color[];
  public xa: number;
  public ya: number;
  public za: number;
  public xx: number;
  public yy: number;
  public zz: number;
  private font!: Font;

  constructor(msg: string, x: number, y: number, col: Color[]) {
    super(x, y);
    this.lifeSpan = 1000; // 60;

    this.msg = msg;
    this.col = col;
    this.xx = x;
    this.yy = y;
    this.zz = 2;
    this.xa = Random.nextGaussian() * 0.3;
    this.ya = Random.nextGaussian() * 0.2;
    this.za = Random.nextFloat() * 0.7 + 2;

    window.resources.load(Font, 'font.json').then(font => (this.font = font));
  }

  update(time: GameTime) {
    super.update(time);

    this.xx += (this.xa * time.deltaTime) / 8;
    this.yy += (this.ya * time.deltaTime) / 8;
    this.zz += (this.za * time.deltaTime) / 8;
    if (this.zz < 0) {
      this.zz = 0;
      // this.za *= -0.5 * time.deltaTime * 16;
      // this.xa *= 0.6 * time.deltaTime * 16;
      // this.ya *= 0.6 * time.deltaTime * 16;

      this.za *= -time.deltaTime / 64;
      this.xa *= time.deltaTime / 32;
      this.ya *= time.deltaTime / 32;
    }
    // this.za -= 0.15;
    this.za -= time.deltaTime / 128;
    this.moveTo(Math.floor(this.xx), Math.floor(this.yy));
  }

  render(tileset: TileSet, camera: Camera) {
    const renderPosition = camera.translate(this.position);
    this.font?.render(
      this.msg,
      renderPosition.x - this.msg.length * 4 + 1,
      renderPosition.y - Math.floor(this.zz) + 1,
      PALETTE.get(-1, 0, 0, 0)
    );
    this.font?.render(
      this.msg,
      renderPosition.x - this.msg.length * 4,
      renderPosition.y - Math.floor(this.zz),
      this.col
    );
  }
}
