import { getWidth, getHeight, createContext, postRender, setPixel, Color } from './display/index.js'
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
 * @param {Color}} color The color to clear to.
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
  x1 = Math.floor(x1);
  x2 = Math.floor(x2);
  y1 = Math.floor(y1);
  y2 = Math.floor(y2);

  if (x1 === x2 && y1 === y2) {
    setPixel(x1, y1, color);
    return;
  }
  
  const xMin = Math.min(x1, x2);
  const xMax = Math.max(x1, x2);
  const yMin = Math.min(y1, y2);
  const yMax = Math.max(y1, y2);
  if (xMin === xMax && yMin !== yMax) {
    for (let y = yMin; y <= yMax; y++) {
      setPixel(xMin, y, color);
    }
  } else if (xMin !== xMax && yMin === yMax) {
    for (let x = xMin; x <= xMax; x++) {
      setPixel(x, yMin, color);
    }
  } else {
    let dx = Math.abs(x2 - x1);
    let sx = (x1 < x2) ? 1 : -1;
    let dy = Math.abs(y2 - y1);
    dy = -dy;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx + dy;
  
    while (true) {
      setPixel(x1, y1, color);
      if ((x1 == x2) && (y1 == y2)) break;
      let e2 = err << 1;
      if (e2 >= dy) {
        if (x1 === x2) break
        err += dy;
        x1 += sx;
      }
      if (e2 <= dx) {
        if (y1 === y2) break;
        err += dx;
        y1 += sy;
      }
    }
  }
}

const render = (totalTime) => {
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
  
  clear({ r: 0, g: 0, b: 64, a: 255 });

  // A single pixel.
  drawLine(100, 100, 100, 100, new Color(255, 0, 0));
  
  // A vertical line.
  drawLine(120, 110, 120, 150, new Color(255, 0, 255));
  
  // A horizontal line.
  drawLine(120, 110, 150, 110, new Color(0, 255, 255));

  const centerX = getWidth() / 2;
  const centerY = getHeight() / 2;
  const radius = Math.min(getWidth(), getHeight()) / 2;

  // radians = degrees * PI / 180

  const radians = (totalTime / 16) * Math.PI / 180;
  const x = centerX + Math.cos(radians) * radius;
  const y = centerY + Math.sin(radians) * radius;
  drawLine(centerX, centerY, x, y, new Color(255, 255, 0));
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000
const onRenderFrame = (totalTime) => {
  if (totalTime - lastUpdateTime >= UPDATE_INTERVAL) {
    console.log('Update!')
    lastUpdateTime = totalTime
  }

  render(totalTime)

  postRender()

  requestAnimationFrame(onRenderFrame)
}

console.log('Here we go.')
console.log(await window.api.sample.ping())

await createContext(256, 256);

// Begin the render loop.
requestAnimationFrame(onRenderFrame)
