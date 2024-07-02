import Item from '../items/Item';
import {GameTime} from '../system/GameTime';
import {PALETTE, TileSet} from '../system/display';
import {Rectangle} from '../system/math';
import UIElement from '../system/ui/UIElement';

const BACKGROUND_COLOR = 0;
const BORDER_COLORS = PALETTE.get(-1, 1, BACKGROUND_COLOR, 445);
const BACKGROUND_COLORS = PALETTE.get(
  BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR
);

export default class ItemFrame extends UIElement {
  private tileset: TileSet;
  private item: (Item | undefined) | (() => Item | undefined);

  constructor(
    tileset: TileSet,
    item: (Item | undefined) | (() => Item | undefined),
    parent: UIElement
  ) {
    super(
      new Rectangle(
        (parent.bounds.width - tileset.tileWidth * 2) >> 1,
        parent.bounds.height - tileset.tileWidth * 2,
        tileset.tileWidth * 2,
        tileset.tileHeight * 2
      ),
      parent
    );
    this.tileset = tileset;
    this.item = item;
  }

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

    let item = this.item;
    if (typeof this.item === 'function') {
      item = this.item();
    }
    if (item) {
      (item as Item).renderIcon(
        this.tileset,
        this.absoluteBounds.x + 4,
        this.absoluteBounds.y + 4
      );
    }

    super.render(time);
  }
}
