import { getWidth, getHeight, createContext, postRender, setPixel, fillRect, Color, drawCircle, clear } from './display/index.js'
import { Image } from './image.js'
import { PALETTE } from './palette.js';
import { Sprite } from './sprite.js';
import { TileSet } from './tileset.js'

await createContext(160, 120);

const image = new Image(await window.api.gfx.getTiles())
const tileset = new TileSet(image, 8, 8);
console.log(tileset);

let mouseCursor = new Sprite(tileset, 0, 29, [-1, -1, -1, 555], 1);
mouseCursor.moveTo(getWidth() / 2, getHeight() / 2);

let player = new Sprite(tileset, 0, 14, [ -1, 100, 220, 532 ]);
player.moveTo(50, 50);

const render = (totalTime) => {
  clear(PALETTE.get(2));

  player.render();
  mouseCursor.render();
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000 / 60;
const onRenderFrame = (totalTime) => {
  if (totalTime - lastUpdateTime >= UPDATE_INTERVAL) {
    // console.log('Update!')
    player.update(totalTime - lastUpdateTime);
    mouseCursor.update(totalTime - lastUpdateTime);
    
    lastUpdateTime = totalTime;
  }

  render(totalTime)

  postRender()

  requestAnimationFrame(onRenderFrame)
}

console.log('Here we go.')
console.log(await window.api.sample.ping())

// Register a key press handler with the window.
window.onkeydown = (e) => {
  const PLAYER_SPEED = 0.05;
  if (e.key === 'ArrowUp') {
    player.dy = -PLAYER_SPEED;
  } else if (e.key === 'ArrowDown') {
    player.dy = PLAYER_SPEED;
  } else if (e.key === 'ArrowLeft') {
    player.dx = -PLAYER_SPEED;
  } else if (e.key === 'ArrowRight') {
    player.dx = PLAYER_SPEED;
  }
}

window.onkeyup = (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    player.dy = 0;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    player.dx = 0;
  }
}

window.addEventListener('mousemove', function(e) {
  // const pos = convertPosition(e.clientX, e.clientY);
  const pos = { x: e.clientX, y: e.clientY };
  console.log(pos);
});

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
