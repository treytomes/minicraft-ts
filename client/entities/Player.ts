import {Camera} from '../Camera';
import {Direction} from '../Direction';
import Inventory from '../Inventory';
import Level from '../Level';
import FurnitureItem from '../items/FurnitureItem';
import Item from '../items/Item';
import PowerGloveItem from '../items/PowerGloveItem';
import {GameTime} from '../system/GameTime';
import {Sound} from '../system/audio/sound';
import {PALETTE, TileSet} from '../system/display';
import Random from '../system/math/Random';
import Entity from './Entity';
import ItemEntity from './ItemEntity';
import Mob from './Mob';
import Workbench from './furniture/Workbench';
import {TextParticle} from './particles';

// TODO: Finish implementing player.
export default class Player extends Mob {
  maxStamina = 10;
  stamina = this.maxStamina;
  staminaRecharge = 0;
  staminaRechargeDelay = 0;
  score = 0;
  invulnerableTime = 0;

  inventory = new Inventory();
  attackItem?: Item;
  activeItem?: Item;

  private attackTime = 0;
  private attackDir = Direction.Undefined;
  private onStairDelay = 0;

  get canSwim() {
    return true;
  }

  constructor() {
    super();

    this.inventory.add(new FurnitureItem(new Workbench()));
    this.inventory.add(new PowerGloveItem());
    // this.activeItem = new PowerGloveItem();
  }

  payStamina(cost: number): boolean {
    if (cost > this.stamina) return false;
    this.stamina -= cost;
    return true;
  }

  render(tileset: TileSet, camera: Camera) {
    const renderPosition = camera.translate(this.position);

    let xt = 0;
    let yt = 14;

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

    if (this.attackTime > 0 && this.attackDir === Direction.North) {
      tileset.render({
        x: xo + 0,
        y: yo - 4,
        tileIndex: 6 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 0,
      });
      tileset.render({
        x: xo + 8,
        y: yo - 4,
        tileIndex: 6 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 1,
      });
      this.attackItem?.renderIcon(tileset, xo + 4, yo - 4);
    }
    let col = PALETTE.get(-1, 100, 220, 532);
    if (this.hurtTime > 0) {
      // Flash white when hurt and invulnerable.
      col = PALETTE.get(-1, 555, 555, 555);
    }

    // Offset when carrying furniture.
    if (this.activeItem instanceof FurnitureItem) {
      yt += 2;
    }
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

    if (this.attackTime > 0 && this.attackDir === Direction.West) {
      tileset.render({
        x: xo - 4,
        y: yo,
        tileIndex: 7 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 1,
      });
      tileset.render({
        x: xo - 4,
        y: yo + 8,
        tileIndex: 7 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 3,
      });
      this.attackItem?.renderIcon(tileset, xo - 4, yo + 4);
    }
    if (this.attackTime > 0 && this.attackDir === Direction.East) {
      tileset.render({
        x: xo + 8 + 4,
        y: yo,
        tileIndex: 7 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 0,
      });
      tileset.render({
        x: xo + 8 + 4,
        y: yo + 8,
        tileIndex: 7 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 2,
      });
      this.attackItem?.renderIcon(tileset, xo + 8 + 4, yo + 4);
    }
    if (this.attackTime > 0 && this.attackDir === Direction.South) {
      tileset.render({
        x: xo + 0,
        y: yo + 8 + 4,
        tileIndex: 6 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 2,
      });
      tileset.render({
        x: xo + 8,
        y: yo + 8 + 4,
        tileIndex: 6 + 13 * 32,
        colors: PALETTE.get(-1, 555, 555, 555),
        bits: 3,
      });
      this.attackItem?.renderIcon(tileset, xo + 4, yo + 8 + 4);
    }

    // Display furniture being carried.
    if (this.activeItem instanceof FurnitureItem) {
      const furniture = (this.activeItem as FurnitureItem).furniture;
      furniture.moveTo(this.position.x, this.position.y - 11);
      furniture.render(tileset, camera);
    }
  }

  touchItem(itemEntity: ItemEntity) {
    itemEntity.take(this);
    this.inventory.add(itemEntity.item);
  }

  touchedBy(entity: Entity) {
    if (!(entity instanceof Player)) {
      entity.touchedBy(this);
    }
  }

  private useRegion(
    level: Level,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): boolean {
    const entities = level.getEntities(x0, y0, x1, y1);
    // console.log('entities:', entities);
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e !== this) if (e.onUsed(this, this.attackDir)) return true;
    }
    return false;
  }

  private interactRegion(
    level: Level,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): boolean {
    // TODO: What if I wanted to interact with a region without an item?
    if (!this.activeItem) return false;

    const entities = level.getEntities(x0, y0, x1, y1);
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e !== this) {
        if (e.interact(this, this.activeItem, this.attackDir)) {
          return true;
        }
      }
    }
    return false;
  }

  private hurtRegion(
    level: Level,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): boolean {
    const entities = level.getEntities(x0, y0, x1, y1);
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e !== this) {
        e.hurt(level, this, this.getAttackDamage(e), this.attackDir);
        return true;
      }
    }
    return false;
  }

  private getAttackDamage(e: Entity): number {
    return (
      Random.nextInt(3) + 1 + (this.attackItem?.getAttackDamageBonus(e) ?? 0)
    );
  }

  protected doHurt(level: Level, damage: number, attackDir: Direction) {
    if (this.hurtTime > 0 || this.invulnerableTime > 0) return;

    Sound.playerhurt.play();
    level.add(
      new TextParticle(
        '' + damage,
        this.position.x,
        this.position.y,
        PALETTE.get(-1, 504, 504, 504)
      )
    );
    this.health -= damage;
    if (attackDir === Direction.South) this.yKnockback = +6;
    if (attackDir === Direction.North) this.yKnockback = -6;
    if (attackDir === Direction.West) this.xKnockback = -6;
    if (attackDir === Direction.East) this.xKnockback = +6;

    const hurtFactor = 32;
    this.hurtTime = 10 * hurtFactor;
    this.invulnerableTime = 30 * hurtFactor;
  }

  // TODO: I feel like this function could be simplified.
  attack(level: Level) {
    this.walkDist += 8;
    this.attackDir = this.dir;
    this.attackItem = this.activeItem;
    let done = false;

    if (this.activeItem) {
      this.attackTime = 10;
      const yo = -2;
      const range = 12; // TODO: Range should be a combination of the entity and item attributes.
      if (
        this.dir === Direction.South &&
        this.interactRegion(
          level,
          this.position.x - 8,
          this.position.y + 4 + yo,
          this.position.x + 8,
          this.position.y + range + yo
        )
      ) {
        done = true;
      }
      if (
        this.dir === Direction.North &&
        this.interactRegion(
          level,
          this.position.x - 8,
          this.position.y - range + yo,
          this.position.x + 8,
          this.position.y - 4 + yo
        )
      ) {
        done = true;
      }
      if (
        this.dir === Direction.East &&
        this.interactRegion(
          level,
          this.position.x + 4,
          this.position.y - 8 + yo,
          this.position.x + range,
          this.position.y + 8 + yo
        )
      ) {
        done = true;
      }
      if (
        this.dir === Direction.West &&
        this.interactRegion(
          level,
          this.position.x - range,
          this.position.y - 8 + yo,
          this.position.x - 4,
          this.position.y + 8 + yo
        )
      ) {
        done = true;
      }
      if (done) return;

      let xt = this.position.x >> 4;
      let yt = (this.position.y + yo) >> 4;
      const r = 12;
      if (this.attackDir === Direction.South) {
        yt = (this.position.y + r + yo) >> 4;
      }
      if (this.attackDir === Direction.North) {
        yt = (this.position.y - r + yo) >> 4;
      }
      if (this.attackDir === Direction.West) {
        xt = (this.position.x - r) >> 4;
      }
      if (this.attackDir === Direction.East) {
        xt = (this.position.x + r) >> 4;
      }

      if (xt >= 0 && yt >= 0 && xt < level.width && yt < level.height) {
        if (
          this.activeItem.interactOn(
            level.getTile(xt, yt),
            level,
            xt,
            yt,
            this,
            this.attackDir
          )
        ) {
          done = true;
        } else {
          if (
            level
              .getTile(xt, yt)
              .interact(level, xt, yt, this, this.activeItem, this.attackDir)
          ) {
            done = true;
          }
        }
        if (this.activeItem.isDepleted) {
          this.activeItem = undefined;
        }
      }
    }

    if (done) return;

    if (!this.activeItem || this.activeItem.canAttack) {
      this.attackTime = 5;
      const yo = -2;
      const range = 20;
      if (this.dir === Direction.South)
        this.hurtRegion(
          level,
          this.position.x - 8,
          this.position.y + 4 + yo,
          this.position.x + 8,
          this.position.y + range + yo
        );
      if (this.dir === Direction.North)
        this.hurtRegion(
          level,
          this.position.x - 8,
          this.position.y - range + yo,
          this.position.x + 8,
          this.position.y - 4 + yo
        );
      if (this.dir === Direction.East)
        this.hurtRegion(
          level,
          this.position.x + 4,
          this.position.y - 8 + yo,
          this.position.x + range,
          this.position.y + 8 + yo
        );
      if (this.dir === Direction.West)
        this.hurtRegion(
          level,
          this.position.x - range,
          this.position.y - 8 + yo,
          this.position.x - 4,
          this.position.y + 8 + yo
        );

      let xt = this.position.x >> 4;
      let yt = (this.position.y + yo) >> 4;
      const r = 12;
      if (this.attackDir === Direction.South) {
        yt = (this.position.y + r + yo) >> 4;
      }
      if (this.attackDir === Direction.North) {
        yt = (this.position.y - r + yo) >> 4;
      }
      if (this.attackDir === Direction.West) {
        xt = (this.position.x - r) >> 4;
      }
      if (this.attackDir === Direction.East) {
        xt = (this.position.x + r) >> 4;
      }
      if (xt >= 0 && yt >= 0 && xt < level.width && yt < level.height) {
        level
          .getTile(xt, yt)
          .hurt(level, xt, yt, this, Random.nextInt(3) + 1, this.attackDir);
      }
    }
  }

  onUse(level: Level): boolean {
    const yo = -2;
    if (
      this.dir === Direction.South &&
      this.useRegion(
        level,
        this.position.x - 8,
        this.position.y + 4 + yo,
        this.position.x + 8,
        this.position.y + 12 + yo
      )
    )
      return true;
    if (
      this.dir === Direction.North &&
      this.useRegion(
        level,
        this.position.x - 8,
        this.position.y - 12 + yo,
        this.position.x + 8,
        this.position.y - 4 + yo
      )
    )
      return true;
    if (
      this.dir === Direction.East &&
      this.useRegion(
        level,
        this.position.x + 4,
        this.position.y - 8 + yo,
        this.position.x + 12,
        this.position.y + 8 + yo
      )
    )
      return true;
    if (
      this.dir === Direction.West &&
      this.useRegion(
        level,
        this.position.x - 12,
        this.position.y - 8 + yo,
        this.position.x - 4,
        this.position.y + 8 + yo
      )
    )
      return true;

    let xt = this.position.x >> 4;
    let yt = (this.position.y + yo) >> 4;
    const r = 12;
    if (this.attackDir === Direction.South)
      yt = (this.position.y + r + yo) >> 4;
    if (this.attackDir === Direction.North)
      yt = (this.position.y - r + yo) >> 4;
    if (this.attackDir === Direction.West) xt = (this.position.x - r) >> 4;
    if (this.attackDir === Direction.East) xt = (this.position.x + r) >> 4;

    if (xt >= 0 && yt >= 0 && xt < level.width && yt < level.height) {
      if (level.getTile(xt, yt).use(level, xt, yt, this, this.attackDir))
        return true;
    }

    return false;
  }

  update(time: GameTime, level: Level) {
    // TODO: Is the invulnerability timer depleting fast enough?
    if (this.invulnerableTime > 0) this.invulnerableTime -= time.deltaTime;

    // TODO: Enable this when we're ready for level transitions.
    // const onTile = level.getTile(this.position.x >> 4, this.position.y >> 4);
    // if (onTile.equals(Tiles.stairsDown) || onTile.equals(Tiles.stairsUp)) {
    //   if (this.onStairDelay === 0) {
    //     this.changeLevel(onTile.equals(Tiles.stairsUp) ? 1 : -1);
    //     this.onStairDelay = 10;
    //     return;
    //   }
    //   this.onStairDelay = 10;
    // } else {
    //   if (this.onStairDelay > 0) this.onStairDelay--;
    // }

    const staminaFactor = 1 / 512;

    if (
      this.stamina <= 0 &&
      this.staminaRechargeDelay <= 0 &&
      this.staminaRecharge <= 0
    ) {
      // TODO: Any constants like this should be entity attributes.
      this.staminaRechargeDelay = 40;
    }

    if (this.staminaRechargeDelay > 0) {
      // console.log('staminaRechargeDelay', this.staminaRechargeDelay);
      this.staminaRechargeDelay -= time.deltaTime * staminaFactor * 12;
    } else {
      // console.log('staminaRechargeDelay is done.', this.staminaRechargeDelay);
    }

    if (this.staminaRechargeDelay <= 0) {
      this.staminaRecharge += time.deltaTime * staminaFactor * 16;
      if (this.isSwimming) {
        this.staminaRecharge = 0;
      }
      while (this.staminaRecharge > 10) {
        this.staminaRecharge -= 10;
        if (this.stamina < this.maxStamina)
          this.stamina += time.deltaTime * staminaFactor * 16;
      }
      // console.log('staminaRecharge', this.staminaRecharge);
      // console.log('stamina', this.stamina);
    }

    // Getting worn out by swimming.
    // console.log('isSwimming:', this.isSwimming);
    // console.log('tickTime:', this.tickTime);
    if (this.isSwimming) {
      this.currentSpeed = this.currentSpeed.multiply(0.75);

      // && this.tickTime % 60 === 0) {
      // console.log('swim check');
      if (this.stamina > 0) {
        this.stamina -= time.deltaTime * staminaFactor;
      } else {
        this.hurt(level, this, 1, this.dir ^ 1);
      }
    }

    if (this.staminaRechargeDelay > 0) {
      // && this.staminaRechargeDelay % 2 === 0) {
      // The basic idea seems to be to slow down the player when stamina runs out.
      // TODO: Make sure this happens.
      this.currentSpeed = this.currentSpeed.multiply(0.5);
      // this.moveBy(this.xa, this.ya);
    }

    if (this.attackTime > 0) this.attackTime -= time.deltaTime / 32;

    super.update(time, level);
  }

  tryAttack(level: Level): boolean {
    if (this.stamina > 0) {
      this.stamina--;
      this.staminaRecharge = 0;
      this.attack(level);
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tryUse(level: Level) {
    return this.onUse(level);
  }
}
