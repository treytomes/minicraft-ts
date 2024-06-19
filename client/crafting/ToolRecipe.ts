import ToolType from '../ToolType';
import Player from '../entities/Player';
import ToolItem from '../items/ToolItem';
import Recipe from './Recipe';

export default class ToolRecipe extends Recipe {
  private type: ToolType;
  private level: number;

  constructor(type: ToolType, level: number) {
    super(new ToolItem(type, level));
    this.type = type;
    this.level = level;
  }

  craft(player: Player) {
    player.inventory.add(new ToolItem(this.type, this.level), 0);
  }
}
