import Recipe from '../crafting/Recipe';
import Player from '../entities/Player';
import ResourceItem from '../items/ResourceItem';
import {GameTime} from '../system/GameTime';
import {Sound} from '../system/audio/sound';
import {Font, PALETTE, TileSet} from '../system/display';
import {Rectangle} from '../system/math';
import {UIElement} from '../system/ui';
import Menu from './Menu';
import WindowFrame from './WindowFrame';

export default class CraftingMenu extends Menu {
  private player: Player;
  private haveFrame: WindowFrame;
  private costFrame: WindowFrame;

  constructor(tileset: TileSet, recipes: Recipe[], player: Player) {
    super(
      recipes,
      tileset,
      'Crafting',
      new Rectangle(1 * 8, 1 * 8, 16 * 8, 24 * 8),
      UIElement.ROOT
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

    this.haveFrame = new WindowFrame(
      this.tileset,
      'Have',
      new Rectangle(12 * 8, 1 * 8, 19 * 8, 3 * 8),
      this
    );
    this.costFrame = new WindowFrame(
      this.tileset,
      'Cost',
      new Rectangle(12 * 8, 4 * 8, 19 * 8, 11 * 8),
      this
    );
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
        Sound.craft.play();
      }
      this.refreshRecipes();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: GameTime) {
    console.log('I am here');
    const font = new Font(this.tileset);

    // Font.renderFrame(screen, "Have", 12, 1, 19, 3);
    // Font.renderFrame(screen, "Cost", 12, 4, 19, 11);
    // Font.renderFrame(screen, "Crafting", 0, 1, 11, 11);
    // renderItemList(screen, 0, 1, 11, 11, recipes, selected);

    if (this.items.length > 0) {
      const recipe = this.selectedItem as Recipe;
      const hasResultItems = this.player.inventory.count(recipe.resultTemplate);
      const xo = 13 * 8;
      this.tileset.render({
        x: xo,
        y: 2 * 8,
        tileIndex: recipe.resultTemplate.icon,
        colors: recipe.resultTemplate.color,
        bits: 0,
      });
      font.render(
        '' + hasResultItems,
        xo + 8,
        2 * 8,
        PALETTE.get(-1, 555, 555, 555)
      );

      const costs = recipe.costs;
      for (let i = 0; i < costs.length; i++) {
        const item = costs[i];
        const yo = (5 + i) * 8;
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
        let has = this.player.inventory.count(item);
        let color = PALETTE.get(-1, 555, 555, 555);
        if (has < requiredAmt) {
          color = PALETTE.get(-1, 222, 222, 222);
        }
        if (has > 99) has = 99;
        font.render('' + requiredAmt + '/' + has, xo + 8, yo, color);
      }
    }

    super.render(time);
  }
}
