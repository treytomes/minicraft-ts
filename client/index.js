import * as system from './system/index.js'
import { Image } from './image.js'
import { PALETTE } from './system/display/palette.js';
import Font from './system/display/Font.js';
import { ButtonUIElement, LabelUIElement, ProgressMeterUIElement, UIElement } from './system/ui/index.js';

await system.display.createContext(160, 120);
// await system.display.createContext(320, 240);

const image = new Image(await window.api.gfx.getTiles())
const tileset = new system.display.TileSet(image, 8, 8);
const font = new Font(tileset);

/**
 * @type {Sprite[]}
 */
const sprites = [];

/**
 * @type {UIElement[]}
 */
const uiElements = [];

let mouseCursor = new system.display.Sprite(tileset, 0, 29, [-1, -1, -1, 555], 1);
mouseCursor.moveTo(system.display.getWidth() / 2, system.display.getHeight() / 2);
// sprites.push(mouseCursor);

let player = new system.display.Sprite(tileset, 0, 14, [ -1, 100, 220, 532 ]);
player.moveTo(50, 50);
sprites.push(player);

const getCounterValue = () => parseInt(localStorage.getItem('counter') ?? 0);

uiElements.push(new LabelUIElement(font, () => `X:${Math.floor(player.x)},Y:${Math.floor(player.y)}`, 0, 0));
uiElements.push(new LabelUIElement(font, () => `Counter:${getCounterValue()}`, 20, 20));

const upButton = new ButtonUIElement(tileset, font, 'Up', 10, 10);
upButton.onClick = () => {
  let counter = getCounterValue();
  counter++;
  localStorage.setItem('counter', counter.toString());
}
uiElements.push(upButton);

const downButton = new ButtonUIElement(tileset, font, 'Down', 40, 10);
downButton.onClick = () => {
  let counter = getCounterValue();
  counter--;
  localStorage.setItem('counter', counter.toString());
}
uiElements.push(downButton);

const healthMeter = new ProgressMeterUIElement(0, system.display.getHeight() - 16, 10, 0 + 12 * 32, tileset, PALETTE.get4(0, 200, 500, 533), PALETTE.get4(0, 100, 0, 0), getCounterValue);
uiElements.push(healthMeter);

const staminaMeter = new ProgressMeterUIElement(0, system.display.getHeight() - 8, 10, 1 + 12 * 32, tileset, PALETTE.get4(0, 220, 550, 553), PALETTE.get4(0, 110, 0, 0), getCounterValue);
uiElements.push(staminaMeter);

let isPlayerSelected = false;

const render = (totalTime) => {
  system.display.clear(PALETTE.get(1));

  for (let n = 0; n < sprites.length; n++) {
    const sprite = sprites[n];
    sprite.render();
  }

  for (let n = 0; n < uiElements.length; n++) {
    const uiElement = uiElements[n];
    uiElement.render();
  }

  mouseCursor.render();
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000 / 60;
const onRenderFrame = (totalTime) => {
  if (totalTime - lastUpdateTime >= UPDATE_INTERVAL) {
    const deltaTime = totalTime - lastUpdateTime;

    for (let n = 0; n < sprites.length; n++) {
      const sprite = sprites[n];
      sprite.update(deltaTime);
    }

    for (let n = 0; n < uiElements.length; n++) {
      const uiElement = uiElements[n];
      uiElement.update(deltaTime);
    }

    mouseCursor.update(deltaTime);
    
    lastUpdateTime = totalTime;
  }

  render(totalTime)

  system.display.postRender()

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

  UIElement.MOUSE_HOVER = undefined;
  for (let n = 0; n < uiElements.length; n++) {
    const uiElement = uiElements[n];
    // console.log(uiElement.bounds, e.clientX, e.clientY);
    if (uiElement.bounds.contains(e.clientX, e.clientY)) {
      uiElement.onMouseMove(e);
      break;
    }
  }
}

/**
 * @param {MouseEvent} e
 */
const onMouseDown = (e) => {
  // Is the left mouse button pressed?
  if (e.button === 0) {
    // Is the mouse hovering over the player sprite?
    if (player.bounds.contains(e.clientX, e.clientY) && !isPlayerSelected) {
      isPlayerSelected = true;
    }

    UIElement.MOUSE_FOCUS = undefined;
    if (UIElement.MOUSE_HOVER) {
      UIElement.MOUSE_HOVER.onMouseDown(e);
    }
  }
}

/**
 * @param {MouseEvent} e
 */
const onMouseUp = (e) => {
  if (e.button === 0) {
    if (isPlayerSelected) {
      isPlayerSelected = false;
    }

    if (UIElement.MOUSE_FOCUS) {
      UIElement.MOUSE_FOCUS.onMouseUp(e);
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
  const pos = system.display.convertPosition(e.clientX, e.clientY);
  onMouseMove({
    clientX: pos.x,
    clientY: pos.y,
    buttons: e.buttons,
  });
});

window.addEventListener('mousedown', function(e) {
  // console.log(e);
  const pos = system.display.convertPosition(e.clientX, e.clientY);
  onMouseDown({
    clientX: pos.x,
    clientY: pos.y,
    button: e.button,
    buttons: e.buttons,
  });
});

window.addEventListener('mouseup', function (e) {
  const pos = system.display.convertPosition(e.clientX, e.clientY);
  onMouseUp({
    clientX: pos.x,
    clientY: pos.y,
    button: e.button,
    buttons: e.buttons,
  });
});

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
