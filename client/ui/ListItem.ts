import {GameTime} from '../system/GameTime';
import {Font, PALETTE, TileSet} from '../system/display';
import {MouseEventProxy} from '../system/input';
import {Rectangle} from '../system/math';
import {UIElement} from '../system/ui';
import IListableItem from './IListableItem';
import Menu from './Menu';

export default class ListItem extends UIElement {
  private readonly item: IListableItem;
  private readonly tileset: TileSet;
  private readonly index: number;

  get isSelected(): boolean {
    return (this.parent as Menu).selectedIndex === this.index;
  }

  set isSelected(value: boolean) {
    (this.parent as Menu).selectedIndex = this.index;
  }

  constructor(
    index: number,
    item: IListableItem,
    tileset: TileSet,
    x: number,
    y: number,
    parent?: UIElement
  ) {
    super(
      new Rectangle(
        x,
        y,
        (parent?.bounds.width ?? tileset.tileWidth) - x,
        tileset.tileHeight
      ),
      parent
    );
    this.index = index;
    this.item = item;
    this.tileset = tileset;
  }

  onMouseUp(e: MouseEventProxy) {
    super.onMouseUp(e);
    (this.parent as Menu).onChooseItem();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: GameTime) {
    if (this.hasMouseHover) {
      this.isSelected = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: GameTime) {
    super.render(time);

    const bounds = this.absoluteBounds;
    this.item.renderInventory(
      this.tileset,
      bounds.x + this.tileset.tileWidth,
      bounds.y
    );

    if (this.isSelected) {
      const font = new Font(this.tileset);
      font.render('>', bounds.x, bounds.y, PALETTE.get(5, 555, 555, 555));
      font.render(
        '<',
        (this.parent?.absoluteBounds.width ?? 0) - this.tileset.tileWidth,
        bounds.y,
        PALETTE.get(5, 555, 555, 555)
      );
    }
  }
}
