// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('api', {
  sample: {
    ping: async () => await ipcRenderer.invoke('sample/ping'),
  },
  gfx: {
    getTiles: async () => await ipcRenderer.invoke('gfx/getTiles'),
  }
});
