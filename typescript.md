npm install @types/electron
npm install typescript

tsconfig.json
Might want to change these settings:
    "removeComments": false,
    "noImplicitAny": false

Had to enable this to allow the server to import Node modules:
  "esModuleInterop": true,


image-js TypeScript definitions were broken:
1. `npm i -D patch-package`
2. Fix the TypeScript errors:
  - Add an RoiManagerOptions type to satisfy parameter constraints.
  - Remove the extra parameter definitions.
3. `npx patch-package image-js`
  - Created `patches/image-js+0.35.5.patch`.
4. `npx patch-package image-js --create-issue`
  - Created a [GitHub Issue](https://github.com/image-js/image-js/issues/636).
Similar with ml-regression-base and ml-regression-exponential.
patch-package was a big help in resolving the little TypeScript bugs.

nodemon
2 instances:
1. Watch for changes in the server and preload folders and restart the Electron app.
2. Watch for changes in the client folder and hot-reload the Electron instance.

The hot-reload function should only run in the development environment.
Use dotenv to setup environment variables:
`npm install dotenv`

The convict library is used to help manage app configuration based on the environment variables:
```
npm install convict
npm install @types/convict --save-dev
```

Check out how I mapped the Environment enum to the convict configuration:
`Object.values(Environment)`.  That along with using a string enum allows the environment selection
to function logically.  This same configuration is exposed through the API that we are sharing
to through the ipcRenderer.

The dotenv is loaded in the app.ts file, then the configuration is spit out to the console.

I'm using the `electron-reloader` package to handle hot-reloading.
