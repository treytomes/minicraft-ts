import {type TileInfo} from '../server/api/gfx';
import {type ResourceManager} from './system/data/resources/ResourceManager';
import {type EventBus} from './system/data/event_bus';

export {};

declare global {
  interface Window {
    api: {
      gfx: {
        getTiles: () => TileInfo;
      };
      file: {
        save: (world: WorldInfo) => string;
      };
      sample: {
        ping: () => string;
      };
      sfx: {
        loadWave: (path: string) => string;
      };
      system: {
        config: () => string;
        exit: (exitCode: number) => void;
      };
    };

    events: EventBus;
    resources: ResourceManager;

    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
    };
  }
}
