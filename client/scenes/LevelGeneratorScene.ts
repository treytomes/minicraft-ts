import Level from '../Level';
import LevelGen from '../LevelGen';
import Game from '../system/Game';
import {GameTime} from '../system/GameTime';
import Scene from '../system/Scene';
import {PALETTE, clear, setPixel} from '../system/display';
import {Keys} from '../system/input';
import {ButtonUIElement, LabelUIElement} from '../system/ui';

export default class LevelGeneratorScene extends Scene {
  private level: Level;
  private depth = 0;

  constructor(game: Game) {
    super(game);

    this.level = LevelGen.createAndValidateMap(0);
    let y = -10;
    const x = this.width - 8 * 7;

    const regenButton = new ButtonUIElement(
      this.tileset,
      this.font,
      'REGEN',
      x,
      (y += 10)
    );
    regenButton.onClick = () => {
      this.level = LevelGen.createAndValidateMap(this.depth);
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
      this.depth += 1;
      if (this.depth > 1) this.depth = 1;
      this.level = LevelGen.createAndValidateMap(this.depth);
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
      this.depth -= 1;
      if (this.depth < -3) this.depth = -3;
      this.level = LevelGen.createAndValidateMap(this.depth);
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

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    const offsetX = (this.width - this.level.width) / 2;
    const offsetY = (this.height - this.level.height) / 2;
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const tile = this.level.getTile(x, y);
        setPixel(offsetX + x, offsetY + y, tile.mapColor);
      }
    }

    super.render(time);
  }

  onKeyDown(e: KeyboardEvent) {
    super.onKeyDown(e);

    if (e.key === Keys.Escape) {
      this.exitScene();
    }
  }
}
