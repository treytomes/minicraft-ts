import {GameTime} from '../system/GameTime';
import {Font, PALETTE, TileSet} from '../system/display';
import {Point, Rectangle} from '../system/math';
import {LabelUIElement, UIElement} from '../system/ui';

const BACKGROUND_COLOR = 5;
const BORDER_COLORS = PALETTE.get(-1, 1, BACKGROUND_COLOR, 445);
const BACKGROUND_COLORS = PALETTE.get(
  BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR
);
const TEXT_COLORS = PALETTE.get(
  BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  550
);

export default class WindowFrame extends UIElement {
  protected readonly tileset: TileSet;
  private readonly title: string;
  private readonly titleLabel: LabelUIElement;

  constructor(
    tileset: TileSet,
    title: string,
    bounds: Rectangle,
    parent?: UIElement
  ) {
    super(bounds, parent);
    this.tileset = tileset;
    this.title = title;

    const font = new Font(this.tileset);
    this.titleLabel = new LabelUIElement(
      font,
      this.title,
      this.tileset.tileWidth,
      0,
      this
    );
    this.titleLabel.colors = TEXT_COLORS;
    this.children.push(this.titleLabel);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: GameTime) {
    const x0 = Math.floor(this.absoluteBounds.left / this.tileset.tileWidth);
    const x1 = Math.floor(this.absoluteBounds.right / this.tileset.tileWidth);
    const y0 = Math.floor(this.absoluteBounds.top / this.tileset.tileHeight);
    const y1 = Math.floor(this.absoluteBounds.bottom / this.tileset.tileHeight);

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (x === x0 && y === y0)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 0,
          });
        else if (x === x1 && y === y0)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 1,
          });
        else if (x === x0 && y === y1)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 2,
          });
        else if (x === x1 && y === y1)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 3,
          });
        else if (y === y0)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 1 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 0,
          });
        else if (y === y1)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 1 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 2,
          });
        else if (x === x0)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 2 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 0,
          });
        else if (x === x1)
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 2 + 13 * 32,
            colors: BORDER_COLORS,
            bits: 1,
          });
        else
          this.tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 2 + 13 * 32,
            colors: BACKGROUND_COLORS,
            bits: 1,
          });
      }
    }

    super.render(time);
  }
}
