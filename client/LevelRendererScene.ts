import Level from './Level';
import Game from './system/Game';
import {GameTime} from './system/GameTime';
import Scene from './system/Scene';
import {PALETTE, clear} from './system/display';
import {Keys} from './system/input';
import {ButtonUIElement, LabelUIElement} from './system/ui';
import * as tiles from './tiles';

export default class LevelRendererScene extends Scene {
  private level: Level;
  private depth = 0;
  private offsetX = 0;
  private offsetY = 0;
  private deltaX = 0;
  private deltaY = 0;

  constructor(game: Game) {
    super(game);

    this.level = new Level(0);
    let y = 0;
    const x = 128 - 24;

    const regenButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'REGEN',
      x,
      (y += 10)
    );
    regenButton.onClick = () => {
      this.level = new Level(this.depth);
    };
    this.uiElements.push(regenButton);

    const upButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'UP',
      x,
      (y += 10)
    );
    upButton.onClick = () => {
      this.depth -= 1;
      if (this.depth < -1) this.depth = -1;
      this.level = new Level(this.depth);
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
      this.depth += 1;
      if (this.depth > 3) this.depth = 3;
      this.level = new Level(this.depth);
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

    this.uiElements.push(
      new LabelUIElement(this.font, () => `DEPTH:${this.depth}`, 0, 0)
    );
  }

  update(time: GameTime) {
    super.update(time);
    this.offsetX += this.deltaX;
    this.offsetY += this.deltaY;
    console.log(this.offsetX, this.offsetY);
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    const offsetX = Math.floor(this.offsetX);
    const offsetY = Math.floor(this.offsetY);
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const tile = this.level.getTile(x, y);
        tile.render(
          x * tiles.Tile.width - offsetX,
          y * tiles.Tile.height - offsetY
        );
      }
    }

    super.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    const PLAYER_SPEED = 1;
    if (e.key === Keys.ArrowUp) {
      this.deltaY = -PLAYER_SPEED;
    } else if (e.key === Keys.ArrowDown) {
      this.deltaY = PLAYER_SPEED;
    } else if (e.key === Keys.ArrowLeft) {
      this.deltaX = -PLAYER_SPEED;
    } else if (e.key === Keys.ArrowRight) {
      this.deltaX = PLAYER_SPEED;
    }

    if (e.key === Keys.Escape) {
      this.exitScene();
    }
  }

  onKeyUp(e: KeyboardEvent) {
    super.onKeyUp(e);

    if (e.key === Keys.ArrowUp || e.key === Keys.ArrowDown) {
      this.deltaY = 0;
    } else if (e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight) {
      this.deltaX = 0;
    }
  }
}
