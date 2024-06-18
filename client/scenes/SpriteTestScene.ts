import {Camera} from '../Camera';
import Entity from '../entities/Entity';
import Player from '../entities/Player';
import Game from '../system/Game';
import {GameTime} from '../system/GameTime';
import Scene from '../system/Scene';
import {PALETTE, clear} from '../system/display';
import {Keys, MouseEventProxy} from '../system/input';
import {Point, Rectangle} from '../system/math';
import {
  ButtonUIElement,
  LabelUIElement,
  ProgressMeterUIElement,
} from '../system/ui';

export default class SpriteTestScene extends Scene {
  private readonly player: Entity;
  private selectedEntity?: Entity = undefined;
  private dragStart?: Point = undefined;
  private camera = new Camera(new Rectangle(0, 0, 0, 0));

  constructor(game: Game) {
    super(game);

    this.player = new Player();
    this.player.moveTo(50, 50);

    this.uiElements.push(
      new LabelUIElement(
        this.font,
        () =>
          `X:${Math.floor(this.player.position.x)},Y:${Math.floor(this.player.position.y)}`,
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

  update(time: GameTime): void {
    // this.player.update(time);
    super.update(time);
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    // Render a giant tree.
    const grassColor = 141;
    // const col = PALETTE.get(10, 30, 151, grassColor);
    // const barkCol1 = PALETTE.get(10, 30, 430, grassColor);
    // const barkCol2 = PALETTE.get(10, 30, 320, grassColor);
    const colors = PALETTE.get(10, 30, 320, grassColor);
    for (let j = 3, x = 150; j <= 10; j++, x += 8) {
      for (let k = 21, y = 150; k <= 28; k++, y += 8) {
        this.tileset.render({
          tileIndex: j + k * this.tileset.tilesPerRow,
          x,
          y,
          colors,
        });
      }
    }

    this.player.render(this.tileset, this.camera);
    super.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    if (e.key === Keys.ArrowUp) {
      this.player.currentSpeed = Point.unitY.multiply(
        this.player.maxSpeed
      ).negate;
    } else if (e.key === Keys.ArrowDown) {
      this.player.currentSpeed = Point.unitY.multiply(this.player.maxSpeed);
    } else if (e.key === Keys.ArrowLeft) {
      this.player.currentSpeed = Point.unitX.multiply(
        this.player.maxSpeed
      ).negate;
    } else if (e.key === Keys.ArrowRight) {
      this.player.currentSpeed = Point.unitX.multiply(this.player.maxSpeed);
    }

    if (e.key === Keys.Escape) {
      this.exitScene();
    }
  }

  onKeyUp(e: KeyboardEvent) {
    super.onKeyUp(e);

    switch (e.key) {
      case Keys.ArrowUp:
      case Keys.ArrowDown:
        // 0 the y-axis
        this.player.currentSpeed = Point.unitX.multiply(
          this.player.currentSpeed.x
        );
        break;
      case Keys.ArrowLeft:
      case Keys.ArrowRight:
        // 0 the x-axis
        this.player.currentSpeed = Point.unitY.multiply(
          this.player.currentSpeed.y
        );
        break;
    }
  }

  onMouseMove(e: MouseEventProxy) {
    super.onMouseMove(e);

    if (this.selectedEntity && this.dragStart) {
      // this.selectedEntity.moveBy(
      //   e.clientX - this.dragStart.x,
      //   e.clientY - this.dragStart.y
      // );
      this.dragStart = new Point(e.clientX, e.clientY);
    }
  }

  onMouseDown(e: MouseEventProxy) {
    super.onMouseDown(e);

    // Is the left mouse button pressed?
    if (e.button === 0) {
      // Is the mouse hovering over the player sprite?
      if (this.player.bounds.contains(e.clientX, e.clientY)) {
        this.selectedEntity = this.player;
        this.dragStart = new Point(e.clientX, e.clientY);
      }
    }
  }

  onMouseUp(e: MouseEventProxy) {
    super.onMouseUp(e);

    if (e.button === 0) {
      this.selectedEntity = undefined;
      this.dragStart = undefined;
    }
  }
}
