import { getWidth, getHeight, createContext, postRender, setPixel, Color, drawCircle, clear } from './display/index.js'
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

class Ball {
  constructor(x = undefined, y = undefined, r = undefined, color = undefined) {
    this.x = x ?? Math.random() * getWidth();
    this.y = y ?? Math.random() * getHeight();
    this.r = r ?? Math.random() * 20 + 10;
    this.color = color ?? new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
    
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
  }

  draw() {
    drawCircle(this.x, this.y, this.r, this.color);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x - this.r <= 0 || this.x + this.r > getWidth()) {
      this.dx = -this.dx;
    }
    if (this.y - this.r <= 0 || this.y + this.r > getHeight()) {
      this.dy = -this.dy;
    }
  }
}

const sprites = []

const render = (totalTime) => {
  clear(new Color(16, 16, 64));

  for (let n = 0; n < sprites.length; n++) {
    sprites[n].draw();
  }
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000 / 60;
const onRenderFrame = (totalTime) => {
  if (totalTime - lastUpdateTime >= UPDATE_INTERVAL) {
    // console.log('Update!')
    lastUpdateTime = totalTime;

    for (let n = 0; n < sprites.length; n++) {
      sprites[n].update();
    }
  }

  render(totalTime)

  postRender()

  requestAnimationFrame(onRenderFrame)
}

console.log('Here we go.')
console.log(await window.api.sample.ping())

await createContext(256, 256);

const NUM_BALLS = 10000;
for (let n = 0; n < NUM_BALLS; n++) {
  sprites.push(new Ball());
}

// Begin the render loop.
requestAnimationFrame(onRenderFrame)
