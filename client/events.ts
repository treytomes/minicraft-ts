import Recipe from './crafting/Recipe';
import {BusEvent} from './system/data/events/BusEvent';
import {Registry} from './system/data/events/Registry';

export const beginCrafting = 'beginCrafting' as BusEvent<Recipe[]>;

export {Registry};
