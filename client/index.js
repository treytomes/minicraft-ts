import { getWidth, getHeight, createContext, postRender, setPixel, fillRect, Color, drawCircle, clear } from './display/index.js'
import { Image } from './image.js'
import { PALETTE } from './palette.js';

class TileSet {
  /**
   * @param {Image} image The source image to pull tiles from.
   * @param {number} tileWidth Tile width.
   * @param {number} tileHeight Tile height.
   */
  constructor(image, tileWidth, tileHeight) {
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tilesPerRow = Math.floor(image.width / tileWidth);
    this.tiles = [];

    const NUM_COLUMNS = Math.floor(image.width / tileWidth);
    const NUM_ROWS = Math.floor(image.height / tileHeight);

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let column = 0; column < NUM_COLUMNS; column++) {
        const x = column * tileWidth;
        const y = row * tileHeight;
        const tile = [];
        for (let yd = 0; yd < tileHeight; yd++) {
          for (let xd = 0; xd < tileWidth; xd++) {
            const { r, g, b } = image.getPixel(x + xd, y + yd);
            const v = Math.floor(r / 64);
            tile.push(v);
          }
        }

        this.tiles.push(tile);
      }
    }
  }

  /**
   * 
   * @param {number} tileIndex Index into the tileset.
   * @param {number} x X-position to draw at.
   * @param {number} y Y-position to draw at.
   * @param {number[]} colors An array of 4 numbers that represents the color of the tile.  -1 is transparent.
   */
  drawTile(tileIndex, x, y, colors) {
    const tile = this.tiles[tileIndex];
    let index = 0;
    for (let yd = 0; yd < this.tileHeight; yd++) {
      for (let xd = 0; xd < this.tileWidth; xd++) {
        const v = tile[index++];
        const c = colors[v];
        if (c) setPixel(x + xd, y + yd, c);
      }
    }
  }
}

const image = new Image(await window.api.gfx.getTiles())
const tileset = new TileSet(image, 8, 8);
console.log(tileset);

let playerX = 50;
let playerY = 50;
let playerDX = 0;
let playerDY = 0;

const render = (totalTime) => {
  clear(PALETTE.get(2));

  // Player.
  const col = PALETTE.get4(-1, 100, 220, 532);
  
  let xt = 0, yt = 14;
  tileset.drawTile(xt + yt * tileset.tilesPerRow, playerX, playerY, col);

  xt = 1, yt = 14;
  tileset.drawTile(xt + yt * tileset.tilesPerRow, playerX + 8, playerY, col);

  xt = 0, yt = 15;
  tileset.drawTile(xt + yt * tileset.tilesPerRow, playerX, playerY + 8, col);

  xt = 1, yt = 15;
  tileset.drawTile(xt + yt * tileset.tilesPerRow, playerX + 8, playerY + 8, col);
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000 / 60;
const onRenderFrame = (totalTime) => {
  if (totalTime - lastUpdateTime >= UPDATE_INTERVAL) {
    // console.log('Update!')
    lastUpdateTime = totalTime;

    playerX += playerDX;
    playerY += playerDY;
  }

  render(totalTime)

  postRender()

  requestAnimationFrame(onRenderFrame)
}

console.log('Here we go.')
console.log(await window.api.sample.ping())

await createContext(160, 120);

// Register a key press handler with the window.
window.onkeydown = (e) => {
  if (e.key === 'ArrowUp') {
    playerDY = -1;
  } else if (e.key === 'ArrowDown') {
    playerDY = 1;
  } else if (e.key === 'ArrowLeft') {
    playerDX = -1;
  } else if (e.key === 'ArrowRight') {
    playerDX = 1;
  }
}

window.onkeyup = (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    playerDY = 0;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    playerDX = 0;
  }
}

// document.addEventListener('keydown', function(e) {
//   //console.log('keydown', e);
//   _instance.onKeyDown(e);
// });

// document.addEventListener('keyup', function(e) {
//   //console.log('keyup', e);
//   _instance.onKeyUp(e);
// });

// document.addEventListener('keypress', function(e) {
//   //console.log('keypress', e);
//   _instance.onKeyPress(e);
// });

// _instance.canvas.addEventListener('mousedown', function(e) {
//     const pos = convertPosition(e.clientX, e.clientY);
//     _instance.onMouseDown(pos.x, pos.y, e.buttons);
// });

// _instance.canvas.addEventListener('mouseup', function(e) {
//     const pos = convertPosition(e.clientX, e.clientY);
//     _instance.onMouseUp(pos.x, pos.y, e.buttons);
// });

// _instance.canvas.addEventListener('mousemove', function(e) {
//     const pos = convertPosition(e.clientX, e.clientY);
//     _instance.onMouseMove(pos.x, pos.y, e.buttons);
// });

// _instance.canvas.addEventListener('touchstart', function(e) {
//     mousePos = getTouchPos(canvas, e);
//     for (let n = 0; n < e.touches.length; n++) {
//         const touch = e.touches[n];
//         const pos = convertPosition(touch.clientX, touch.clientY);
//         _instance.onMouseMove(pos.x, pos.y, 1);
//     }
// });

// _instance.canvas.addEventListener('touchend', function(e) {
//     _instance.onMouseUp(null, null, 1);
// });

// _instance.canvas.addEventListener('touchmove', function(e) {
//     for (let n = 0; n < e.touches.length; n++) {
//         const touch = e.touches[n];
//         const pos = convertPosition(touch.clientX, touch.clientY);
//         _instance.onMouseMove(pos.x, pos.y, 1);
//     }
// });


// Begin the render loop.
requestAnimationFrame(onRenderFrame)
