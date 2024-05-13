import { type TileInfo } from "../server/api/gfx";

export { };

declare global {
  interface Window {
    api: {
      gfx: {
        getTiles: () => TileInfo,
      }
      sample: {
        ping: () => string,
      },
    };

    versions: {
      node: () => string,
      chrome: () => string,
      electron: () => string,
    };
  }
}