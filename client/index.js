import { SCREEN_WIDTH, SCREEN_HEIGHT, createContext, postRender, setPixel } from './system/index.js';

const image = await window.api.gfx.getTiles();
console.log(image);

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

const render = (time) => {
  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      setPixel(x, y, { r: x ^ y, g: x & y, b: x | y })
    }
  }
  
  setPixel(100, 100, { r: 255, g: 255, b: 0 })

  console.log(image.width, image.height);
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const offset = y * image.width * image.components + x * image.components;
      const r = image.data[offset + 0];
      const g = image.data[offset + 1];
      const b = image.data[offset + 2];
      setPixel(x, y, { r, g, b });
    }
  }
}

let lastUpdateTime = 0;
const UPDATE_INTERVAL = 1000;
const onRenderFrame = (time) => {
  if (time - lastUpdateTime >= UPDATE_INTERVAL) {
    console.log('Update!');
    lastUpdateTime = time;
  }

  render(time);

  postRender(time);

  requestAnimationFrame(onRenderFrame);
}

console.log('Here we go.');
console.log(await window.api.sample.ping());

await createContext();

// Begin the render loop.
requestAnimationFrame(onRenderFrame);
