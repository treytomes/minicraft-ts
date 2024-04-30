import * as system from './system/index.js'
import { Image } from './image.js'
import { PALETTE } from './palette.js';
import { Font } from './Font.js';
import TileSet from './system/display/TileSet.js';

/**
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */
class UIElement {
  static MOUSE_HOVER = undefined;
  static MOUSE_FOCUS = undefined;

  constructor(x, y, width, height) {
    this.bounds = new system.math.Rectangle(x, y, width, height);
  }

  /**
   * @returns {boolean} Is the mouse hovering over this UI element?
   */
  get hasMouseHover() {
    return UIElement.MOUSE_HOVER === this;
  }

  /**
   * @returns {boolean} Is the mouse focused on this UI element?
   */
  get hasMouseFocus() {
    return UIElement.MOUSE_FOCUS === this;
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseMove(e) {
    UIElement.MOUSE_HOVER = this;
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseDown(e) {
    UIElement.MOUSE_FOCUS = this;
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseUp(e) {
    UIElement.MOUSE_FOCUS = undefined;
  }

  update(deltaTime) { }
  render() {}
}

/**
 * A Label that can be positioned anywhere on the screen.
 * 
 * @property {Font} font
 * @property {any} text The value to render.  If this is a function, the result will be reevaluated at the time of render.
 * @property {number} x
 * @property {number} y
 */
class LabelUIElement extends UIElement {
  /**
   * @param {Font} font 
   * @param {any} text 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(font, text, x, y) {
    super(x, y, font.width * text.length, font.height);

    this.font = font;
    this.text = text;
    this.colors = PALETTE.get4(-1, -1, -1, 550);
  }

  update(deltaTime) {}

  render() {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    this.font.render(text?.toString() ?? 'null', this.bounds.x, this.bounds.y, this.colors);
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
  /**
   * @param {system.display.TileSet} tileset 
   * @param {Font} font 
   * @param {any} text 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(tileset, font, text, x, y) {
    super(x, y, font.width * text.length + tileset.tileWidth * 2, font.height);

    this.tileset = tileset;
    this.font = font;
    this.text = text;
    this.chromeColors = PALETTE.get4(222, -1, -1, -1);
    this.textColors = PALETTE.get4(222, -1, -1, 550);
    this.onClick = () => { };
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseUp(e) {
    super.onMouseUp(e);
    this.onClick();
  }

  update(deltaTime) {
    if (this.hasMouseFocus) {
      this.chromeColors[0] = PALETTE.get(111);
      this.textColors[0] = PALETTE.get(111);
    } else if (this.hasMouseHover) {
      this.chromeColors[0] = PALETTE.get(333);
      this.textColors[0] = PALETTE.get(333);
    } else {
      this.chromeColors[0] = PALETTE.get(222);
      this.textColors[0] = PALETTE.get(222);
    }
  }

  render() {
    let text = this.text;
    if (typeof this.text === 'function') {
      text = this.text();
    }
    text = text?.toString() ?? 'null';

    // Left side of button.
    this.tileset.render(1 + 29 * 32, this.bounds.x, this.bounds.y, this.chromeColors);

    // Button text.
    this.font.render(text, this.bounds.x + this.tileset.tileWidth, this.bounds.y, this.textColors);
    
    // Right side of button.
    this.tileset.render(
      1 + 29 * 32,
      this.bounds.x + this.tileset.tileWidth + text.length * this.tileset.tileWidth,
      this.bounds.y,
      this.chromeColors,
      system.display.BIT_MIRROR_X
    );
  }
}

class ProgressMeterUIElement extends UIElement {
  /**
   * @type {TileSet}
   */
  #tileset;

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} maxValue 
   * @param {number} tileIndex
   * @param {TileSet} tileset 
   * @param {Color[]} onColor
   * @param {Color[]} offColor
   * @param {()=>number | undefined} currentValue
   */
  constructor(x, y, maxValue, tileIndex, tileset, onColor, offColor, currentValue=undefined) {
    super(x, y, tileset.tileWidth * maxValue, tileset.tileHeight);
    this.#tileset = tileset;
    this.maxValue = maxValue;
    if (currentValue) {
      this.currentValue = currentValue;
    } else {
      this.currentValue = this.maxValue;
    }
    this.tileIndex = tileIndex;
    this.onColor = onColor;
    this.offColor = offColor;
  }

  render() {
    let value = this.currentValue;
    if (typeof this.currentValue === 'function') {
      value = this.currentValue();
    }
    for (let n = 0; n < this.maxValue; n++) {
      if (n < value) {
        this.#tileset.render(this.tileIndex, this.bounds.x + n * this.#tileset.tileWidth, this.bounds.y, this.onColor);
      } else {
        this.#tileset.render(this.tileIndex, this.bounds.x + n * this.#tileset.tileWidth, this.bounds.y, this.offColor);
      }
    }
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
