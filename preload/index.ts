// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,

  // we can also expose variables, not just functions
});

// contextBridge.exposeInMainWorld('config', config);

contextBridge.exposeInMainWorld('api', {
  sample: {
    ping: async () => await ipcRenderer.invoke('sample/ping')
  },
  gfx: {
    getTiles: async () => await ipcRenderer.invoke('gfx/getTiles')
  },
  system: {
    config: async () => await ipcRenderer.invoke('system/config'),
    exit: async (exitCode: number) => await ipcRenderer.invoke('system/exit', exitCode),
  },
});
