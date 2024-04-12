import { getWidth, getHeight, createContext, postRender, setPixel } from './display/index.js'
import { Image } from './image.js'

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

/**
 * Clear the screen to a color.
 * 
 * @param {{r: number, g: number, b: number}} color The color to clear to.
 */
const clear = (color) => {
  for (let y = 0; y < getHeight(); y++) {
    for (let x = 0; x < getWidth(); x++) {
      setPixel(x, y, color);
    }
  }
}

/**
 * Draw an arbitrary line across the screen.
 * 
 * @param {number} x1 The starting x-value.
 * @param {number} y1 The starting y-value.
 * @param {number} x2 The ending x-value.
 * @param {number} y2 The ending y-value.
 * @param {{r: number, g: number, b: number}} color The line color.
 */
const drawLine = (x1, y1, x2, y2, color) => {
  if (x1 === x2 && y1 === y2) {
    setPixel(x1, y1, color);
    return;
  } else if (x1 === x2 && y1 !== y2) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      setPixel(x1, y, color);
    }
  } else if (x1 !== x2 && y1 === y2) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      setPixel(x, y1, color);
      console.log("setPixel: ", x, y1, color);
    }
    console.log("Horizonal line!");
  }
}

const render = (time) => {
  // for (let y = 0; y < getWidth(); y++) {
  //   for (let x = 0; x < getHeight(); x++) {
  //     setPixel(x, y, { r: x ^ y, g: x & y, b: x | y })
  //   }
  // }

  // setPixel(100, 100, { r: 255, g: 255, b: 0 })

  // console.log(image.width, image.height)
  // for (let y = 0; y < image.height; y++) {
  //   for (let x = 0; x < image.width; x++) {
  //     setPixel(x, y, image.getPixel(x, y))
  //   }
  // }
  
  clear({ r: 0, g: 0, b: 64 });

  // drawLine(50, 50, 203, 174, { r: 255, g: 255, b: 0 });

  // A single pixel.
  drawLine(100, 100, 100, 100, { r: 255, g: 0, b: 0 });
  
  // A vertical line.
  drawLine(120, 110, 120, 150, { r: 255, g: 0, b: 255 });
  
  // A horizontal line.
  drawLine(120, 110, 150, 110, { r: 0, g: 255, b: 255 });
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000
const onRenderFrame = (time) => {
  if (time - lastUpdateTime >= UPDATE_INTERVAL) {
    console.log('Update!')
    lastUpdateTime = time
  }

  render(time)

  postRender(time)

  requestAnimationFrame(onRenderFrame)
}

console.log('Here we go.')
console.log(await window.api.sample.ping())

await createContext(256, 256);

// Begin the render loop.
requestAnimationFrame(onRenderFrame)
