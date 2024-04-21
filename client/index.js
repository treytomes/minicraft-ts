import { getWidth, getHeight, createContext, postRender, setPixel, fillRect, Color, drawCircle, clear } from './display/index.js'
import { Image } from './image.js'
import { PALETTE } from './palette.js';

const image = new Image(await window.api.gfx.getTiles())
// console.log(image)

function loadTiles() {
  // const colorKey = [0x00, 0x00, 0x00]
  // //let ch = 0;
  // let ptr = memory.MemoryMap.instance.fontMemory
  // for (let row = 0; row < 16; row++) {
  //   for (let column = 0; column < 16; column++) {
  //     const x = column * 8
  //     const y = row * 8
  //     for (let yd = 0; yd < 8; yd++) {
  //       let byte = 0
  //       for (let xd = 0; xd < 8; xd++) {
  //         byte = byte << 1
  //         const c = image.getPixelXY(x + xd, y + yd)
  //         if (c[0] !== colorKey[0] || c[1] !== colorKey[1] || c[2] !== colorKey[2]) {
  //           byte = byte + 1
  //         }
  //       }
  //       memory.HEAPU8[ptr] = byte
  //       ptr++
  //     }
  //     //ch++;
  //   }
  // }
}

const render = (totalTime) => {
  clear(PALETTE.get(2));

  // Level 0 grass.
  // const col = PALETTE.get4(141, 141, 141 + 111, 141 + 111);

  // Workbench.
  // Color.get(-1, 100, 321, 431);
  const col = PALETTE.get4(-1, 100, 321, 431);

  console.log("col=", col);

  for (let y = 0; y < getHeight(); y++) {
    for (let x = 0; x < getWidth(); x++) {
      let { r, g, b } = image.getPixel(x, y);
      let v = Math.floor(r / 64);
      if (col[v]) setPixel(x, y, col[v]);
    }
  }
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000 / 60;
const onRenderFrame = (totalTime) => {
  if (totalTime - lastUpdateTime >= UPDATE_INTERVAL) {
    // console.log('Update!')
    lastUpdateTime = totalTime;
  }

  render(totalTime)

  postRender()

  requestAnimationFrame(onRenderFrame)
}

console.log('Here we go.')
console.log(await window.api.sample.ping())

await createContext(160, 120);

// Begin the render loop.
requestAnimationFrame(onRenderFrame)
