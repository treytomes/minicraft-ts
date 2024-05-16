import NineSlice from './NineSlice';
import Game from './system/Game';
import {GameTime} from './system/GameTime';
import Scene from './system/Scene';
import {Color, PALETTE, clear, drawEllipse, drawLine} from './system/display';
import {Keys, MouseEventProxy} from './system/input';

const BLINK_INTERVAL_MS = 500;

export default class PixelsTestScene extends Scene {
  constructor(game: Game) {
    super(game);
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    const r = 40;
    const dx = this.width / 2;
    const dy = this.height / 2;
    console.log(this.width, this.height, dx, dy);
    // drawCircle(dx, dy, r, new Color(255, 0, 0), Math.floor(totalTime / blinkIntervalMs) % 2 === 0);
    drawEllipse(
      dx,
      dy,
      r / 2 + r * Math.sin(time.totalTime / 256),
      r + (r / 2) * Math.cos(time.totalTime / 256),
      new Color(255, 0, 0),
      Math.floor(time.totalTime / BLINK_INTERVAL_MS) % 2 === 0
    );

    drawLine(0, 0, this.width - 1, this.height - 1, new Color(255, 0, 0));

    const text = 'HELLO';
    const x = 50;
    const y = 50;
    const slicer = new NineSlice(
      this.tileset,
      0 + 26 * this.tileset.tilesPerRow,
      text.length + 1,
      2
    );
    slicer.render(50, 50, PALETTE.get(-1, 112, 223, 334));
    this.font.render(text, x + 6, y + 6, PALETTE.get(-1, -1, -1, 0));
    this.font.render(text, x + 5, y + 5, PALETTE.get(-1, -1, -1, 555));

    super.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    if (e.key === Keys.Escape) {
      this.exitScene();
    }
  }

  onKeyUp(e: KeyboardEvent) {
    super.onKeyUp(e);
  }

  onMouseMove(e: MouseEventProxy) {
    super.onMouseMove(e);
  }

  onMouseDown(e: MouseEventProxy) {
    super.onMouseDown(e);
  }

  onMouseUp(e: MouseEventProxy) {
    super.onMouseUp(e);
  }
}
