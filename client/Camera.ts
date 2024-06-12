import Entity from './entities/Entity';
import {GameTime} from './system/GameTime';
import {Point, Rectangle} from './system/math';

export class Camera {
  private position = Point.zero;
  private bounds: Rectangle;

  constructor(bounds: Rectangle) {
    this.bounds = bounds;
  }

  moveTo(point: Point) {
    this.position = point.clamp(this.bounds);
    // console.log('move:', point, this.position, this.bounds);
  }

  moveBy(delta: Point) {
    // console.log('moveBy:', delta, this.position, this.bounds);
    this.moveTo(this.position.add(delta));
  }

  translate(point: Point): Point;
  translate(rect: Rectangle): Rectangle;
  translate(x: number, y: number): Point;
  translate(
    pointOrRectOrX: Point | Rectangle | number,
    y?: number
  ): Point | Rectangle {
    if (pointOrRectOrX instanceof Point) {
      return pointOrRectOrX.subtract(this.position);
    } else if (pointOrRectOrX instanceof Rectangle) {
      const pnt = this.translate(pointOrRectOrX.x, pointOrRectOrX.y);
      return new Rectangle(
        pnt.x,
        pnt.y,
        pointOrRectOrX.width,
        pointOrRectOrX.height
      );
    } else if (y !== undefined) {
      return this.translate(new Point(pointOrRectOrX, y));
    }
    throw new Error('Invalid arguments.');
  }

  follow(time: GameTime, offset: Point, entity: Entity, speed: number) {
    const target = entity.position.subtract(offset);
    // const delta = moveTo.subtract(this.position).normalized;
    // this.moveBy(delta.multiply(speed * time.deltaTime));

    // this.moveTo(entity.position.subtract(offset));

    this.moveTo(Point.lerp(speed * time.deltaTime, this.position, target));
  }
}
