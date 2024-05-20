import LevelGen, {TileIDs} from './LevelGen';
import Game from './system/Game';
import {GameTime} from './system/GameTime';
import Scene from './system/Scene';
import {Color, PALETTE, clear, setPixel} from './system/display';
import {Keys, MouseEventProxy} from './system/input';
import {ButtonUIElement, LabelUIElement} from './system/ui';

const LEVEL_WIDTH = 128;
const LEVEL_HEIGHT = 128;

export default class LevelGeneratorScene extends Scene {
  private level: number[];
  private depth = 0;

  constructor(game: Game) {
    super(game);

    this.level = LevelGen.createAndValidateTopMap(LEVEL_WIDTH, LEVEL_HEIGHT)[0];
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
      this.regenLevel();
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
      this.regenLevel();
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
      this.regenLevel();
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

  regenLevel() {
    if (this.depth === -1) {
      this.level = LevelGen.createAndValidateSkyMap(
        LEVEL_WIDTH,
        LEVEL_HEIGHT
      )[0];
    } else if (this.depth === 0) {
      this.level = LevelGen.createAndValidateTopMap(
        LEVEL_WIDTH,
        LEVEL_HEIGHT
      )[0];
    } else {
      this.level = LevelGen.createAndValidateUndergroundMap(
        LEVEL_WIDTH,
        LEVEL_HEIGHT,
        this.depth
      )[0];
    }
  }

  render(time: GameTime) {
    clear(PALETTE.get(1)[0]);

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
      for (let x = 0; x < LEVEL_WIDTH; x++) {
        const i = x + y * LEVEL_WIDTH;

        if (this.level[i] === TileIDs.water) {
          setPixel(x, y, new Color(0, 0, 0x80));
        } else if (this.level[i] === TileIDs.grass) {
          setPixel(x, y, new Color(0x20, 0x80, 0x20));
        } else if (this.level[i] === TileIDs.rock) {
          setPixel(x, y, new Color(0xa0, 0xa0, 0xa0));
        } else if (this.level[i] === TileIDs.dirt) {
          setPixel(x, y, new Color(0x60, 0x40, 0x40));
        } else if (this.level[i] === TileIDs.sand) {
          setPixel(x, y, new Color(0xa0, 0xa0, 0x40));
        } else if (this.level[i] === TileIDs.tree) {
          setPixel(x, y, new Color(0x00, 0x30, 0x00));
        } else if (this.level[i] === TileIDs.lava) {
          setPixel(x, y, new Color(0xff, 0x20, 0x20));
        } else if (this.level[i] === TileIDs.cloud) {
          setPixel(x, y, new Color(0xa0, 0xa0, 0xa0));
        } else if (this.level[i] === TileIDs.stairsDown) {
          setPixel(x, y, new Color(0xff, 0xff, 0xff));
        } else if (this.level[i] === TileIDs.stairsUp) {
          setPixel(x, y, new Color(0xff, 0xff, 0xff));
        } else if (this.level[i] === TileIDs.cloudCactus) {
          setPixel(x, y, new Color(0xff, 0x00, 0xff));
        } else if (this.level[i] === TileIDs.flower) {
          setPixel(x, y, new Color(0xee, 0x22, 0xee));
        } else if (this.level[i] === TileIDs.cactus) {
          setPixel(x, y, new Color(0, 0xee, 0));
        } else if (this.level[i] === TileIDs.infiniteFall) {
          setPixel(x, y, new Color(0, 0, 0));
        } else if (
          [TileIDs.ironOre, TileIDs.goldOre, TileIDs.gemOre].includes(
            this.level[i]
          )
        ) {
          setPixel(x, y, new Color(0xff, 0xff, 0));
        } else {
          console.log('unknown tile id:', this.level[i]);
          setPixel(x, y, new Color(0xff, 0, 0));
        }
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
