import Recipe from './crafting/Recipe';
import {BusEvent, Registry} from './event_bus';

export const beginCrafting = 'beginCrafting' as BusEvent<Recipe[]>;

export {Registry};
