import { getWidth, getHeight, createContext, postRender, setPixel, fillRect, Color, drawCircle, clear } from './display/index.js'
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

class Palette {
  constructor() {
    this.colors = [];
    for (let r = 0; r <= 5; r++) {
      for (let g = 0; g <= 5; g++) {
        for (let b = 0; b <= 5; b++) {
          const rr = Math.floor(r * 255 / 5);
          const gg = Math.floor(g * 255 / 5);
          const bb = Math.floor(b * 255 / 5);
          const mid = Math.floor((rr * 30 + gg * 59 + bb * 11) / 100);

          const r1 = Math.floor(((rr + mid * 1) / 2) * 230 / 255 + 10);
          const g1 = Math.floor(((gg + mid * 1) / 2) * 230 / 255 + 10);
          const b1 = Math.floor(((bb + mid * 1) / 2) * 230 / 255 + 10);
          
          // palette.push bitOr(bitOr(shl(r1, 16), shl(g1, 8)), b1)
          this.colors.push(new Color(r1, g1, b1));
        }
      }
    }
  }

  // get4(a, b, c, d) {
  //   return (this.get(d) << 24) + (this.get(c) << 16) + (this.get(b) << 8) + (this.get(a));
  // }

  get(d) {
    if (d < 0) return 255;
    const r = Math.floor(d / 100) % 10;
    const g = Math.floor(d / 10) % 10;
    const b = d % 10;
    return this.colors[r * 36 + g * 6 + b];
  }
}
const palette = new Palette();

class Ball {
  constructor(x = undefined, y = undefined, r = undefined, color = undefined) {
    this.r = r ?? Math.random() * 20 + 10;
    this.x = x ?? Math.random() * getWidth();
    this.y = y ?? Math.random() * getHeight();

    if (this.x - this.r < 0) {
      this.x = this.r;
    } else if (this.x + this.r >= getWidth()) {
      this.x = getWidth() - this.r;
    }
    if (this.y - this.r < 0) {
      this.y = this.r;
    } else if (this.y + this.r >= getHeight()) {
      this.y = getHeight() - this.r;
    }

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

  // for (let n = 0; n < sprites.length; n++) {
  //   sprites[n].draw();
  // }

  let x = 0;
  let y = 0;
  let counter = 0;
  const SIZE = 8;
  for (let r = 0; r <= 5; r++) {
    for (let g = 0; g <= 5; g++) {
      for (let b = 0; b <= 5; b++) {
        const c = palette.get(r * 100 + g * 10 + b);
        fillRect(x, y, SIZE - 1, SIZE - 1, palette.get(555));
        fillRect(x + 1, y + 1, SIZE - 3, SIZE - 3, c);
        x += SIZE;
        counter++;
        if (counter >= 15) {
          x = 0;
          y += SIZE;
          counter = 0;
        }
      }
    }
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

await createContext(160, 120);

const NUM_BALLS = 8;
for (let n = 0; n < NUM_BALLS; n++) {
  sprites.push(new Ball());
}

// Begin the render loop.
requestAnimationFrame(onRenderFrame)
