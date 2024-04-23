import { getWidth, getHeight, createContext, postRender, setPixel, fillRect, Color, drawCircle, clear, convertPosition } from './display/index.js'
import { Image } from './image.js'
import { PALETTE } from './palette.js';
import { Sprite } from './sprite.js';
import { TileSet } from './tileset.js'

await createContext(160, 120);

const image = new Image(await window.api.gfx.getTiles())
const tileset = new TileSet(image, 8, 8);

let mouseCursor = new Sprite(tileset, 0, 29, [-1, -1, -1, 555], 1);
mouseCursor.moveTo(getWidth() / 2, getHeight() / 2);

let player = new Sprite(tileset, 0, 14, [ -1, 100, 220, 532 ]);
player.moveTo(50, 50);

let isPlayerSelected = false;

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

console.log('Here we go.');
console.log(await window.api.sample.ping());

const onKeyDown = (e) => {
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

const onKeyUp = (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    player.dy = 0;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    player.dx = 0;
  }
}

/**
 * @param {MouseEvent} e
 */
const onMouseMove = (e) => {
  mouseCursor.moveTo(e.clientX, e.clientY);

  if (isPlayerSelected) {
    const bounds = player.bounds;
    player.moveTo(e.clientX - bounds.width / 2, e.clientY - bounds.height / 2);
  }
}

/**
 * @param {MouseEvent} e
 */
const onMouseDown = (e) => {
  // Is the left mouse button pressed?
  if (e.button === 0) {
    // console.log("Click: ", e.clientX, e.clientY, player.bounds, player.bounds.contains(e.clientX, e.clientY));
    // Is the mouse hovering over the player sprite?
    if (player.bounds.contains(e.clientX, e.clientY) && !isPlayerSelected) {
      console.log("You picked the player!");
      isPlayerSelected = true;
    }
  }
}

/**
 * @param {MouseEvent} e
 */
const onMouseUp = (e) => {
  console.log("Mouse up");
  if (e.button === 0) {
    console.log("Left mouse button up");
    if (isPlayerSelected) {
      console.log("Release!");
      isPlayerSelected = false;
    }
  }
}

// window.addEventListener('onkeydown', onKeyDown);
// window.addEventListener('onkeyup', onKeyUp);
window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;

/**
 * @param {MouseEvent} e
 */
window.addEventListener('mousemove', function(e) {
  const pos = convertPosition(e.clientX, e.clientY);
  onMouseMove({
    clientX: pos.x,
    clientY: pos.y,
    buttons: e.buttons,
  });
});

window.addEventListener('mousedown', function(e) {
  console.log(e);
  const pos = convertPosition(e.clientX, e.clientY);
  onMouseDown({
    clientX: pos.x,
    clientY: pos.y,
    button: e.button,
    buttons: e.buttons,
  });
});

window.addEventListener('mouseup', function (e) {
  const pos = convertPosition(e.clientX, e.clientY);
  onMouseUp({
    clientX: pos.x,
    clientY: pos.y,
    button: e.button,
    buttons: e.buttons,
  });
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
