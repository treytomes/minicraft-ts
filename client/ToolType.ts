export default class ToolType {
  static shovel = new ToolType('Shvl', 0);
  static hoe = new ToolType('Hoe', 1);
  static sword = new ToolType('Swrd', 2);
  static pickaxe = new ToolType('Pick', 3);
  static axe = new ToolType('Axe', 4);

  readonly name: string;
  readonly sprite: number;

  private constructor(name: string, sprite: number) {
    this.name = name;
    this.sprite = sprite;
  }
}
