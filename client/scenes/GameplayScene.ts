import {Camera} from '../Camera';
import World from '../World';
import Game from '../system/Game';
import {GameTime} from '../system/GameTime';
import Scene from '../system/Scene';
import {PALETTE, clear} from '../system/display';
import {Keys} from '../system/input';
import {Point, Rectangle} from '../system/math';
import {
  ButtonUIElement,
  LabelUIElement,
  ProgressMeterUIElement,
  UIElement,
} from '../system/ui';
import {Tile} from '../tiles';
import InventoryMenu from '../ui/InventoryMenu';
import ItemFrame from '../ui/ItemFrame';

export default class GameplayScene extends Scene {
  private world: World;
  private camera: Camera;
  private cameraOffset: Point;
  private modal?: UIElement;

  constructor(game: Game) {
    super(game);

    this.world = World.createNew();

    this.cameraOffset = new Point(this.width, this.height).multiply(0.5);

    this.camera = new Camera(
      new Rectangle(
        0,
        0,
        this.world.width * Tile.width - this.width,
        this.world.height * Tile.height - this.height
      )
    );
    this.camera.moveTo(this.world.player!.position.subtract(this.cameraOffset));

    let y = -10;
    const x = this.width - 7 * 8;

    const upButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'UP',
      x,
      (y += 10),
      this.uiRoot
    );
    upButton.onClick = () => {
      this.world.currentDepth++;
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
      this.world.currentDepth--;
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

    new LabelUIElement(
      this.font,
      () => `DEPTH:${this.world.currentDepth}`,
      0,
      0,
      this.uiRoot
    );

    // Health Meter
    new ProgressMeterUIElement(
      0,
      this.height - 16,
      10,
      0 + 12 * 32,
      this.tileset,
      PALETTE.get(0, 200, 500, 533),
      PALETTE.get(0, 100, 0, 0),
      () => this.world.player?.health ?? 0,
      this.uiRoot
    );

    // Stamina Meter
    new ProgressMeterUIElement(
      0,
      this.height - 8,
      10,
      1 + 12 * 32,
      this.tileset,
      PALETTE.get(0, 220, 550, 553),
      PALETTE.get(0, 110, 0, 0),
      () => this.world.player?.stamina ?? 0,
      this.uiRoot
    );

    new ItemFrame(
      this.tileset,
      () => this.world.player?.activeItem,
      this.uiRoot
    );
  }

  update(time: GameTime) {
    super.update(time);
    if (!UIElement.KEYBOARD_FOCUS) {
      this.world.update(time);
      if (this.world.player) {
        this.camera.follow(
          time,
          this.cameraOffset,
          this.world.player,
          this.world.player.maxSpeed / 32
        );
      }
      Tile.updateTicks(time);
    }
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    this.world.render(this.tileset, this.camera);

    super.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    // TODO: GetInputAxis --> Direction --> Vector.

    if (!UIElement.KEYBOARD_FOCUS && this.world.player) {
      switch (e.key) {
        case Keys.ArrowUp:
          this.world.player.currentSpeed = new Point(
            this.world.player.currentSpeed.x,
            -this.world.player.maxSpeed
          );
          break;
        case Keys.ArrowDown:
          this.world.player.currentSpeed = new Point(
            this.world.player.currentSpeed.x,
            this.world.player.maxSpeed
          );
          break;
        case Keys.ArrowLeft:
          this.world.player.currentSpeed = new Point(
            -this.world.player.maxSpeed,
            this.world.player.currentSpeed.y
          );
          break;
        case Keys.ArrowRight:
          this.world.player.currentSpeed = new Point(
            this.world.player.maxSpeed,
            this.world.player.currentSpeed.y
          );
          break;
        case Keys.Space:
          this.world.player.tryAttack(this.world.currentLevel);
          break;
        case Keys.Tab:
          new InventoryMenu(this.world.player, this.tileset, this.uiRoot);
          break;
        default:
          console.log('You pressed: ', e.key);
      }
    }
    switch (e.key) {
      case Keys.Escape:
        this.exitScene();
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    super.onKeyUp(e);

    if (!this.world.player) return;

    switch (e.key) {
      case Keys.ArrowUp:
      case Keys.ArrowDown:
        // 0 the y-axis
        this.world.player.currentSpeed = new Point(
          this.world.player.currentSpeed.x,
          0
        );

        break;
      case Keys.ArrowLeft:
      case Keys.ArrowRight:
        // 0 the x-axis
        this.world.player.currentSpeed = new Point(
          0,
          this.world.player.currentSpeed.y
        );
        break;
    }
  }
}
