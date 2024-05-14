import NineSlice from './NineSlice';
import Game from './system/Game';
import {GameTime} from './system/GameTime';
import Scene from './system/Scene';
import {
  Color,
  PALETTE,
  Sprite,
  clear,
  drawEllipse,
  drawLine,
} from './system/display';
import {Keys, MouseEventProxy} from './system/input';
import {
  ButtonUIElement,
  LabelUIElement,
  ProgressMeterUIElement,
} from './system/ui';

const BLINK_INTERVAL_MS = 500;

export default class SpriteTestScene extends Scene {
  private _player: Sprite | undefined;
  public isPlayerSelected = false;

  get player(): Sprite {
    if (!this._player) throw new Error('Content is not loaded.');
    return this._player;
  }

  constructor(game: Game) {
    super(game);

    this._player = new Sprite(this.tileset, 0, 14, [-1, 100, 220, 532]);
    this._player.moveTo(50, 50);
    this.sprites.push(this._player);

    this.uiElements.push(
      new LabelUIElement(
        this.font,
        () => `X:${Math.floor(this.player.x)},Y:${Math.floor(this.player.y)}`,
        0,
        0
      )
    );
    this.uiElements.push(
      new LabelUIElement(
        this.font,
        () => `Counter:${this.getCounterValue()}`,
        20,
        20
      )
    );

    const upButton = new ButtonUIElement(this.tileset, this.font, 'Up', 10, 10);
    upButton.onClick = () => {
      let counter = this.getCounterValue();
      counter++;
      localStorage.setItem('counter', counter.toString());
    };
    this.uiElements.push(upButton);

    const downButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'Down',
      40,
      10
    );
    downButton.onClick = () => {
      let counter = this.getCounterValue();
      counter--;
      localStorage.setItem('counter', counter.toString());
    };
    this.uiElements.push(downButton);

    const healthMeter = new ProgressMeterUIElement(
      0,
      this.height - 16,
      10,
      0 + 12 * 32,
      this.tileset,
      PALETTE.get(0, 200, 500, 533),
      PALETTE.get(0, 100, 0, 0),
      this.getCounterValue
    );
    this.uiElements.push(healthMeter);

    const staminaMeter = new ProgressMeterUIElement(
      0,
      this.height - 8,
      10,
      1 + 12 * 32,
      this.tileset,
      PALETTE.get(0, 220, 550, 553),
      PALETTE.get(0, 110, 0, 0),
      this.getCounterValue
    );
    this.uiElements.push(staminaMeter);
  }

  getCounterValue(): number {
    return parseInt(localStorage.getItem('counter') ?? '0');
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    const r = 40;
    const dx = this.width / 2;
    const dy = this.height / 2;
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

    const PLAYER_SPEED = 0.05;
    if (e.key === Keys.ArrowUp) {
      this.player.dy = -PLAYER_SPEED;
    } else if (e.key === Keys.ArrowDown) {
      this.player.dy = PLAYER_SPEED;
    } else if (e.key === Keys.ArrowLeft) {
      this.player.dx = -PLAYER_SPEED;
    } else if (e.key === Keys.ArrowRight) {
      this.player.dx = PLAYER_SPEED;
    }

    if (e.key === Keys.Escape) {
      // this.game.scenes.pop();
      window.api.system.exit(0);
    }
  }

  onKeyUp(e: KeyboardEvent) {
    super.onKeyUp(e);

    if (e.key === Keys.ArrowUp || e.key === Keys.ArrowDown) {
      this.player.dy = 0;
    } else if (e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight) {
      this.player.dx = 0;
    }
  }

  onMouseMove(e: MouseEventProxy) {
    super.onMouseMove(e);

    if (this.isPlayerSelected) {
      const bounds = this.player.bounds;
      this.player.moveTo(
        e.clientX - bounds.width / 2,
        e.clientY - bounds.height / 2
      );
    }
  }

  onMouseDown(e: MouseEventProxy) {
    super.onMouseDown(e);

    // Is the left mouse button pressed?
    if (e.button === 0) {
      // Is the mouse hovering over the player sprite?
      if (
        this.player.bounds.contains(e.clientX, e.clientY) &&
        !this.isPlayerSelected
      ) {
        this.isPlayerSelected = true;
      }
    }
  }

  onMouseUp(e: MouseEventProxy) {
    super.onMouseUp(e);

    if (e.button === 0) {
      if (this.isPlayerSelected) {
        this.isPlayerSelected = false;
      }
    }
  }
}
