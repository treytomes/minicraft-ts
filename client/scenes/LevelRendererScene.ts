import Level from '../Level';
import {Tile} from '../tiles/Tile';
import Game from '../system/Game';
import {GameTime} from '../system/GameTime';
import Scene from '../system/Scene';
import {PALETTE, clear} from '../system/display';
import {Keys} from '../system/input';
import {ButtonUIElement, LabelUIElement} from '../system/ui';
import {Point, Rectangle} from '../system/math';
import {Camera} from '../Camera';
import LevelGen from '../LevelGen';

const PLAYER_SPEED = 1;

export default class LevelRendererScene extends Scene {
  private level: Level;
  private depth = 0;
  private camera: Camera;
  private delta = Point.zero;

  constructor(game: Game) {
    super(game);

    this.level = LevelGen.createAndValidateMap(0);

    this.camera = new Camera(
      new Rectangle(
        0,
        0,
        this.level.width * Tile.width - this.width,
        this.level.height * Tile.height - this.height
      )
    );

    let y = -10;
    const x = this.width - 7 * 8;

    const regenButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'REGEN',
      x,
      (y += 10),
      this.uiRoot
    );
    regenButton.onClick = () => {
      this.level = LevelGen.createAndValidateMap(this.depth);
    };

    const upButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'UP',
      x,
      (y += 10),
      this.uiRoot
    );
    upButton.onClick = () => {
      this.depth += 1;
      if (this.depth > 1) this.depth = 1;
      this.level = LevelGen.createAndValidateMap(this.depth);
    };

    const downButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'DOWN',
      x,
      (y += 10),
      this.uiRoot
    );
    downButton.onClick = () => {
      this.depth -= 1;
      if (this.depth < -3) this.depth = -3;
      this.level = LevelGen.createAndValidateMap(this.depth);
    };

    const backButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'BACK',
      x,
      (y += 10),
      this.uiRoot
    );
    backButton.onClick = () => {
      this.exitScene();
    };

    new LabelUIElement(
      this.font,
      () => `DEPTH:${this.depth}`,
      0,
      0,
      this.uiRoot
    );
  }

  update(time: GameTime) {
    super.update(time);
    this.camera.moveBy(this.delta);
    Tile.updateTicks(time);
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const tile = this.level.getTile(x, y);
        tile.render(
          this.tileset,
          this.level,
          x * Tile.width,
          y * Tile.height,
          this.camera
        );
      }
    }

    super.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    switch (e.key) {
      case Keys.ArrowUp:
        this.delta = Point.unitX
          .multiply(this.delta.x)
          .add(Point.unitY.multiply(PLAYER_SPEED).negate);
        break;
      case Keys.ArrowDown:
        this.delta = Point.unitX
          .multiply(this.delta.x)
          .add(Point.unitY.multiply(PLAYER_SPEED));
        break;
      case Keys.ArrowLeft:
        this.delta = Point.unitY
          .multiply(this.delta.y)
          .add(Point.unitX.multiply(PLAYER_SPEED).negate);
        break;
      case Keys.ArrowRight:
        this.delta = Point.unitY
          .multiply(this.delta.y)
          .add(Point.unitX.multiply(PLAYER_SPEED));
        break;
      case Keys.Escape:
        this.exitScene();
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    super.onKeyUp(e);

    switch (e.key) {
      case Keys.ArrowUp:
      case Keys.ArrowDown:
        // 0 the y-axis
        this.delta = Point.unitX.multiply(this.delta.x);
        break;
      case Keys.ArrowLeft:
      case Keys.ArrowRight:
        // 0 the x-axis
        this.delta = Point.unitY.multiply(this.delta.y);
        break;
    }
  }
}
