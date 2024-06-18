import {Camera} from '../../Camera';
import {Sound} from '../../system/audio/sound';
import {PALETTE, TileSet} from '../../system/display';
import Particle from './Particle';

export default class SmashParticle extends Particle {
  constructor(x: number, y: number) {
    super(x, y);
    this.lifeSpan = 10;
    Sound.monsterhurt.play();
  }

  render(tileset: TileSet, camera: Camera) {
    const col = PALETTE.get(-1, 555, 555, 555);
    const renderPosition = camera.translate(this.position);
    tileset.render({
      x: renderPosition.x - 8,
      y: renderPosition.y - 8,
      tileIndex: 5 + 12 * 32,
      colors: col,
      bits: 2,
    });
    tileset.render({
      x: renderPosition.x - 0,
      y: renderPosition.y - 8,
      tileIndex: 5 + 12 * 32,
      colors: col,
      bits: 3,
    });
    tileset.render({
      x: renderPosition.x - 8,
      y: renderPosition.y - 0,
      tileIndex: 5 + 12 * 32,
      colors: col,
      bits: 0,
    });
    tileset.render({
      x: renderPosition.x - 0,
      y: renderPosition.y - 0,
      tileIndex: 5 + 12 * 32,
      colors: col,
      bits: 1,
    });
  }
}
