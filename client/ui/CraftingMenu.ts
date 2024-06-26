import Recipe from '../crafting/Recipe';
import Player from '../entities/Player';
import ResourceItem from '../items/ResourceItem';
import {GameTime} from '../system/GameTime';
import {Font, PALETTE, TileSet} from '../system/display';
import {Rectangle} from '../system/math';
import {UIElement} from '../system/ui';
import Menu from './Menu';
import WindowFrame from './WindowFrame';
import * as sounds from '../sounds';

class HaveWindowFrame extends WindowFrame {
  constructor(tileset: TileSet, parent: CraftingMenu) {
    super(tileset, 'Have', new Rectangle(15 * 8, 1 * 8, 9 * 8, 3 * 8), parent);
  }

  render(time: GameTime): void {
    super.render(time);

    const recipe = (this.parent as CraftingMenu).selectedItem as Recipe;
    const hasResultItems = (this.parent as CraftingMenu).player.inventory.count(
      recipe.resultTemplate
    );

    const xo = 17 * 8;
    const yo = 3 * 8;

    this.tileset.render({
      x: xo,
      y: yo,
      tileIndex: recipe.resultTemplate.icon,
      colors: recipe.resultTemplate.color,
      bits: 0,
    });

    const font = new Font(this.tileset);
    font.render(
      '' + hasResultItems,
      xo + 8,
      yo,
      PALETTE.get(-1, 555, 555, 555)
    );
  }
}

class CostWindowFrame extends WindowFrame {
  constructor(tileset: TileSet, parent: CraftingMenu) {
    super(tileset, 'Cost', new Rectangle(15 * 8, 5 * 8, 9 * 8, 7 * 8), parent);
  }

  render(time: GameTime): void {
    super.render(time);

    const font = new Font(this.tileset);
    const costs = ((this.parent as CraftingMenu).selectedItem as Recipe).costs;
    for (let i = 0; i < costs.length; i++) {
      const item = costs[i];
      const xo = 17 * 8;
      const yo = (7 + i) * 8;
      this.tileset.render({
        x: xo,
        y: yo,
        tileIndex: item.icon,
        colors: item.color,
      });
      let requiredAmt = 1;
      if (item instanceof ResourceItem) {
        requiredAmt = (item as ResourceItem).count;
      }
      let has = (this.parent as CraftingMenu).player.inventory.count(item);
      let color = PALETTE.get(-1, 555, 555, 555);
      if (has < requiredAmt) {
        color = PALETTE.get(-1, 222, 222, 222);
      }
      if (has > 99) has = 99;
      font.render('' + requiredAmt + '/' + has, xo + 8, yo, color);
    }
  }
}

export default class CraftingMenu extends Menu {
  public player: Player;
  private haveFrame: WindowFrame;
  private costFrame: WindowFrame;

  constructor(
    tileset: TileSet,
    recipes: Recipe[],
    player: Player,
    parent?: UIElement
  ) {
    super(
      recipes,
      tileset,
      'Crafting',
      new Rectangle(1 * 8, 1 * 8, 16 * 8, 24 * 8),
      parent
    );
    this.player = player;

    this.refreshRecipes();

    // TODO: Recipe sorting would be nice.
    // Collections.sort(this.recipes, new Comparator<Recipe>() {
    // 	public int compare(Recipe r1, Recipe r2) {
    // 		if (r1.canCraft && !r2.canCraft) return -1;
    // 		if (!r1.canCraft && r2.canCraft) return 1;
    // 		return 0;
    // 	}
    // });

    this.haveFrame = new HaveWindowFrame(tileset, this);
    this.costFrame = new CostWindowFrame(tileset, this);

    this.acquireKeyboardFocus();
  }

  private refreshRecipes() {
    for (let i = 0; i < this.items.length; i++) {
      const recipe = this.items[i] as Recipe;
      recipe.checkCanCraft(this.player);
    }
  }

  update(time: GameTime): void {
    super.update(time);

    if (this.input.menu.clicked) this.close();

    if (this.input.attack.clicked && this.items.length > 0) {
      const r = this.selectedItem as Recipe;
      r.checkCanCraft(this.player);
      if (r.canCraft) {
        r.deductCost(this.player);
        r.craft(this.player);
        sounds.craft.play();
      }
      this.refreshRecipes();
    }
  }
}
