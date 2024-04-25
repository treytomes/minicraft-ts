import * as system from './system/index.js'
import { Image } from './image.js'
import { PALETTE } from './palette.js';
import { Font } from './Font.js';

class UIElement {
  update(deltaTime) {}
  render() {}
}

class LabelUIElement extends UIElement {
  constructor(font, text, x, y) {
    super();
    this.font = font;
    this.text = text;
    this.x = x;
    this.y = y;
    this.colors = PALETTE.get4(-1, -1, -1, 550);
  }

  update(deltaTime) {}

  render() {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    this.font.render(text?.toString() ?? 'null', this.x, this.y, this.colors);
  }
}

/**
 * @property {system.display.TileSet} tileset
 * @property {Font} font
 * @property {string} text
 * @property {number} x
 * @property {number} y
 * @property {Color[]} chromeColors
 * @property {Color[]} textColors
 */
class ButtonUIElement extends UIElement {
  constructor(tileset, font, text, x, y) {
    super();
    this.tileset = tileset;
    this.font = font;
    this.text = text;
    this.x = x;
    this.y = y;
    this.chromeColors = PALETTE.get4(3, -1, -1, -1);
    this.textColors = PALETTE.get4(3, -1, -1, 550);
  }

  update(deltaTime) {}

  render() {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    text = text?.toString() ?? 'null';

    this.tileset.render(1 + 29 * 32, this.x, this.y, this.chromeColors);

    this.font.render(text, this.x + this.tileset.tileWidth, this.y, this.textColors);
    this.tileset.render(1 + 29 * 32, this.x + this.tileset.tileWidth + text.length * this.tileset.tileWidth, this.y, this.chromeColors, system.display.BIT_MIRROR_X);
  }
}

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

uiElements.push(new LabelUIElement(font, () => `X:${Math.floor(player.x)},Y:${Math.floor(player.y)}`, 0, 0));
uiElements.push(new ButtonUIElement(tileset, font, 'Click me!', 10, 10));

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
