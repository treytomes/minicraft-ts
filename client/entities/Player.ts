import {Camera} from '../Camera';
import {Direction} from '../Direction';
import {PALETTE, TileSet} from '../system/display';
import Mob from './Mob';

// TODO: Finish implementing player.
export default class Player extends Mob {
  maxStamina = 10;
  stamina = this.maxStamina;

  get canSwim() {
    return true;
  }

  constructor(x: number, y: number) {
    super(x, y);
  }

  payStamina(cost: number): boolean {
    if (cost > this.stamina) return false;
    this.stamina -= cost;
    return true;
  }

  render(tileset: TileSet, camera: Camera) {
    const renderPosition = camera.translate(this.position);
    // console.log('Player position:', renderPosition);

    let xt = 0;
    const yt = 14;

    let flip1 = (this.walkDist >> 3) & 1;
    let flip2 = (this.walkDist >> 3) & 1;

    if (this.dir === Direction.North) {
      xt += 2;
    }
    if (this.dir === Direction.East || this.dir === Direction.West) {
      flip1 = 0;
      flip2 = (this.walkDist >> 4) & 1;
      if (this.dir === Direction.West) {
        flip1 = 1;
      }
      xt += 4 + ((this.walkDist >> 3) & 1) * 2;
    }

    const xo = renderPosition.x - 8;
    let yo = renderPosition.y - 11;

    // Draw ripples around the entity while swimming.
    if (this.isSwimming) {
      yo += 4;

      let waterColor = PALETTE.get(-1, -1, 115, 335);
      if ((this.tickTime >> 3) % 2 === 0) {
        waterColor = PALETTE.get(-1, 335, 5, 115);
      }

      tileset.render({
        x: xo + 0,
        y: yo + 3,
        tileIndex: 5 + 13 * 32,
        colors: waterColor,
        bits: 0,
      });
      tileset.render({
        x: xo + 8,
        y: yo + 3,
        tileIndex: 5 + 13 * 32,
        colors: waterColor,
        bits: 1,
      });
    }

    // // TODO: Implement this when attackDir and attackItem are ready to go.
    // if (attackTime > 0 && attackDir == 1) {
    // 	screen.render(xo + 0, yo - 4, 6 + 13 * 32, Color.get(-1, 555, 555, 555), 0);
    // 	screen.render(xo + 8, yo - 4, 6 + 13 * 32, Color.get(-1, 555, 555, 555), 1);
    // 	if (attackItem != null) {
    // 		attackItem.renderIcon(screen, xo + 4, yo - 4);
    // 	}
    // }
    let col = PALETTE.get(-1, 100, 220, 532);
    if (this.hurtTime > 0) {
      // Flash white when hurt?
      col = PALETTE.get(-1, 555, 555, 555);
    }

    // TODO: Offset when carrying furniture.
    // if (activeItem instanceof FurnitureItem) {
    // 	yt += 2;
    // }
    tileset.render({
      x: xo + 8 * flip1,
      y: yo + 0,
      tileIndex: xt + yt * 32,
      colors: col,
      bits: flip1,
    });
    tileset.render({
      x: xo + 8 - 8 * flip1,
      y: yo + 0,
      tileIndex: xt + 1 + yt * 32,
      colors: col,
      bits: flip1,
    });
    if (!this.isSwimming) {
      tileset.render({
        x: xo + 8 * flip2,
        y: yo + 8,
        tileIndex: xt + (yt + 1) * 32,
        colors: col,
        bits: flip2,
      });
      tileset.render({
        x: xo + 8 - 8 * flip2,
        y: yo + 8,
        tileIndex: xt + 1 + (yt + 1) * 32,
        colors: col,
        bits: flip2,
      });
    }

    // TODO: Implement when attackTime and attackDir are ready to go.
    // if (attackTime > 0 && attackDir == 2) {
    //   screen.render(xo - 4, yo, 7 + 13 * 32, Color.get(-1, 555, 555, 555), 1);
    //   screen.render(
    //     xo - 4,
    //     yo + 8,
    //     7 + 13 * 32,
    //     Color.get(-1, 555, 555, 555),
    //     3
    //   );
    //   if (attackItem != null) {
    //     attackItem.renderIcon(screen, xo - 4, yo + 4);
    //   }
    // }
    // if (attackTime > 0 && attackDir == 3) {
    //   screen.render(
    //     xo + 8 + 4,
    //     yo,
    //     7 + 13 * 32,
    //     Color.get(-1, 555, 555, 555),
    //     0
    //   );
    //   screen.render(
    //     xo + 8 + 4,
    //     yo + 8,
    //     7 + 13 * 32,
    //     Color.get(-1, 555, 555, 555),
    //     2
    //   );
    //   if (attackItem != null) {
    //     attackItem.renderIcon(screen, xo + 8 + 4, yo + 4);
    //   }
    // }
    // if (attackTime > 0 && attackDir == 0) {
    //   screen.render(
    //     xo + 0,
    //     yo + 8 + 4,
    //     6 + 13 * 32,
    //     Color.get(-1, 555, 555, 555),
    //     2
    //   );
    //   screen.render(
    //     xo + 8,
    //     yo + 8 + 4,
    //     6 + 13 * 32,
    //     Color.get(-1, 555, 555, 555),
    //     3
    //   );
    //   if (attackItem != null) {
    //     attackItem.renderIcon(screen, xo + 4, yo + 8 + 4);
    //   }
    // }

    // TODO: Activate this bit to display furniture being carried.
    // if (activeItem instanceof FurnitureItem) {
    // 	Furniture furniture = ((FurnitureItem) activeItem).furniture;
    // 	furniture.x = x;
    // 	furniture.y = yo;
    // 	furniture.render(screen);
    // }
  }
}
