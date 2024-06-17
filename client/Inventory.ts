import Item from './items/Item';
import ResourceItem from './items/ResourceItem';
import {Resource} from './resources';

export default class Inventory {
  readonly items: Item[] = [];

  add(item: Item, slot?: number) {
    if (item instanceof ResourceItem) {
      const toTake = item as ResourceItem;
      const has = this.findResource(toTake.resource);
      if (!has) {
        // Insert `toTake` into `this.items` as index `slot`.
        // TODO: Make sure this works.
        if (slot) {
          this.items.splice(slot, 0, toTake);
        } else {
          this.items.push(toTake);
        }
      } else {
        has.count += toTake.count;
      }
    } else {
      if (slot) {
        this.items.splice(slot, 0, item);
      } else {
        this.items.push(item);
      }
    }
  }

  findResource(resource: Resource): ResourceItem | undefined {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] instanceof ResourceItem) {
        const has = this.items[i] as ResourceItem;
        if (has.resource === resource) return has;
      }
    }
    return undefined;
  }

  hasResources(r: Resource, count: number): boolean {
    const ri = this.findResource(r);
    if (!ri) return false;
    return ri.count >= count;
  }

  removeResource(r: Resource, count: number): boolean {
    const ri = this.findResource(r);
    if (!ri) return false;
    if (ri.count < count) return false;
    ri.count -= count;
    if (ri.count <= 0) {
      // TODO: Make sure resources are removed.
      const index = this.items.indexOf(ri);
      this.items.splice(index, 1);
    }
    return true;
  }

  count(item: Item): number {
    if (item instanceof ResourceItem) {
      const ri = this.findResource(item.resource);
      if (ri) return ri.count;
    } else {
      let count = 0;
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].matches(item)) count++;
      }
      return count;
    }
    return 0;
  }
}
