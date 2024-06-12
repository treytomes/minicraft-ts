import {Camera} from '../Camera';
import World from '../World';
import Player from '../entities/Player';
import Game from '../system/Game';
import {GameTime} from '../system/GameTime';
import Scene from '../system/Scene';
import {PALETTE, clear} from '../system/display';
import {Keys} from '../system/input';
import {Point, Rectangle} from '../system/math';
import {ButtonUIElement, LabelUIElement} from '../system/ui';
import {Tile} from '../tiles';

const PLAYER_SPEED = 1;

export default class GameplayScene extends Scene {
  private world: World;
  private camera: Camera;
  private delta = Point.zero;

  constructor(game: Game) {
    super(game);

    this.world = new World();

    this.camera = new Camera(
      new Rectangle(
        0,
        0,
        this.world.width * Tile.width - this.width,
        this.world.height * Tile.height - this.height
      )
    );

    let y = -10;
    const x = this.width - 7 * 8;

    const upButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'UP',
      x,
      (y += 10)
    );
    upButton.onClick = () => {
      this.world.currentDepth++;
    };
    this.uiElements.push(upButton);

    const downButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'DOWN',
      x,
      (y += 10)
    );
    downButton.onClick = () => {
      this.world.currentDepth--;
    };
    this.uiElements.push(downButton);

    const backButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'BACK',
      x,
      (y += 10)
    );
    backButton.onClick = () => {
      this.exitScene();
    };
    this.uiElements.push(backButton);

    const saveButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'SAVE',
      x,
      (y += 10)
    );
    saveButton.onClick = async () => {
      const savePath = await window.api.file.save(this.world.serialize());
      console.log(`Saved to ${JSON.stringify(savePath)}`);
    };
    this.uiElements.push(saveButton);

    this.uiElements.push(
      new LabelUIElement(
        this.font,
        () => `DEPTH:${this.world.currentDepth}`,
        0,
        0
      )
    );
  }

  update(time: GameTime) {
    super.update(time);
    this.camera.moveBy(this.delta);
    Tile.updateTicks(time);
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    this.world.render(this.tileset, this.camera);

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
