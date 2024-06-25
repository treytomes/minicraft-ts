import {type TileInfo} from '../server/api/gfx';
import {type EventBus} from './event_bus';

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

    eventBus: EventBus;

    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
    };
  }
}
