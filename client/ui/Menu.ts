import {GameTime} from '../system/GameTime';
import {TileSet} from '../system/display';
import {Keys} from '../system/input';
import {Rectangle} from '../system/math';
import {UIElement} from '../system/ui';
import IListableItem from './IListableItem';
import ListItem from './ListItem';
import WindowFrame from './WindowFrame';

export default class Menu extends WindowFrame {
  private readonly items: IListableItem[] = [];
  public selectedIndex = 0;

  get selectedItem(): IListableItem {
    return this.items[this.selectedIndex];
  }

  constructor(
    items: IListableItem[],
    tileset: TileSet,
    title: string,
    bounds: Rectangle,
    parent?: UIElement
  ) {
    super(tileset, title, bounds, parent);

    for (let n = 0; n < items.length; n++) {
      this.addItem(items[n]);
    }
    this.selectedIndex = 0;

    UIElement.KEYBOARD_FOCUS = this;
  }

  onChooseItem() {}

  protected addItem(item: IListableItem) {
    this.items.push(item);
    const listItem = new ListItem(
      this.items.length - 1,
      item,
      this.tileset,
      this.tileset.tileWidth,
      this.items.length * this.tileset.tileHeight,
      this
    );
    this.children.push(listItem);
  }

  update(time: GameTime): void {
    super.update(time);

    if (this.input.up.clicked) {
      this.selectedIndex--;
      if (this.selectedIndex < 0) {
        this.selectedIndex = this.items.length - 1;
      }
    }
    if (this.input.down.clicked) {
      this.selectedIndex++;
      if (this.selectedIndex >= this.items.length) {
        this.selectedIndex = 0;
      }
    }
  }

  // renderItemList(listItems: IListableItem[], selected: number) {
  //   const xo = Math.floor(this.absoluteBounds.left / this.tileset.tileWidth);
  //   const x1 = Math.floor(this.absoluteBounds.right / this.tileset.tileWidth);
  //   const yo = Math.floor(this.absoluteBounds.top / this.tileset.tileHeight);
  //   const y1 = Math.floor(this.absoluteBounds.bottom / this.tileset.tileHeight);

  //   let renderCursor = true;
  //   if (selected < 0) {
  //     selected = -selected - 1;
  //     renderCursor = false;
  //   }
  //   const w = x1 - xo;
  //   const h = y1 - yo - 1;
  //   const i0 = 0;
  //   let i1 = listItems.length;
  //   if (i1 > h) i1 = h;
  //   let io = selected - h / 2;
  //   if (io > listItems.length - h) io = listItems.length - h;
  //   if (io < 0) io = 0;

  //   for (let i = i0; i < i1; i++) {
  //     listItems[i + io].renderInventory(
  //       this.tileset,
  //       (1 + xo) * 8,
  //       (i + 1 + yo) * 8
  //     );
  //   }

  //   if (renderCursor) {
  //     const yy = selected + 1 - io + yo;
  //     const font = new Font(this.tileset);
  //     font.render('>', (xo + 0) * 8, yy * 8, PALETTE.get(5, 555, 555, 555));
  //     font.render('<', (xo + w) * 8, yy * 8, PALETTE.get(5, 555, 555, 555));
  //   }
  // }
}
