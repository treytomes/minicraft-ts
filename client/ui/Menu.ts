import {GameTime} from '../system/GameTime';
import {Font, PALETTE, TileSet} from '../system/display';
import ListItem from './ListItem';

export default class Menu {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: GameTime) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(tileset: TileSet) {}

  renderFrame(
    tileset: TileSet,
    title: string,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (x === x0 && y === y0)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 0,
          });
        else if (x === x1 && y === y0)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 1,
          });
        else if (x === x0 && y === y1)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 2,
          });
        else if (x === x1 && y === y1)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 0 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 3,
          });
        else if (y === y0)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 1 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 0,
          });
        else if (y === y1)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 1 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 2,
          });
        else if (x === x0)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 2 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 0,
          });
        else if (x === x1)
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 2 + 13 * 32,
            colors: PALETTE.get(-1, 1, 5, 445),
            bits: 1,
          });
        else
          tileset.render({
            x: x * 8,
            y: y * 8,
            tileIndex: 2 + 13 * 32,
            colors: PALETTE.get(5, 5, 5, 5),
            bits: 1,
          });
      }
    }

    const font = new Font(tileset);
    font.render(title, x0 * 8 + 8, y0 * 8, PALETTE.get(5, 5, 5, 550));
  }

  renderItemList(
    tileset: TileSet,
    xo: number,
    yo: number,
    x1: number,
    y1: number,
    listItems: ListItem[],
    selected: number
  ) {
    let renderCursor = true;
    if (selected < 0) {
      selected = -selected - 1;
      renderCursor = false;
    }
    const w = x1 - xo;
    const h = y1 - yo - 1;
    const i0 = 0;
    let i1 = listItems.length;
    if (i1 > h) i1 = h;
    let io = selected - h / 2;
    if (io > listItems.length - h) io = listItems.length - h;
    if (io < 0) io = 0;

    for (let i = i0; i < i1; i++) {
      listItems[i + io].renderInventory(
        tileset,
        (1 + xo) * 8,
        (i + 1 + yo) * 8
      );
    }

    if (renderCursor) {
      const yy = selected + 1 - io + yo;
      const font = new Font(tileset);
      font.render('>', (xo + 0) * 8, yy * 8, PALETTE.get(5, 555, 555, 555));
      font.render('<', (xo + w) * 8, yy * 8, PALETTE.get(5, 555, 555, 555));
    }
  }
}
