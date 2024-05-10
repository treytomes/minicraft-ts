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

