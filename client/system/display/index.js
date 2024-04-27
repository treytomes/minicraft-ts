import * as html from '../html/index.js';
import Color from './Color.js';
import Sprite from './Sprite.js';
import TileSet, { BIT_MIRROR_X, BIT_MIRROR_Y } from './TileSet.js';

export { Color, Sprite, TileSet, BIT_MIRROR_X, BIT_MIRROR_Y };

/**
 * Container for the details necessary to render to the screen.
 * 
 * @type {{
 *          canvas: HTMLCanvasElement,
 *          width: number,
 *          height: number,
 *          bpp: number,
 *          stride: number,
 *          pixels: Uint8ClampedArray,
 *          ctx2d: CanvasRenderingContext2D,
 *        }}
 */
export let context;

export const getWidth = () => context.width;
export const getHeight = () => context.height;
export const getOffset = (x, y) => (y * context.width + x) * context.bpp;

/**
 * Clear the screen to a color.
 * 
 * @param {Color} color The color to clear to.
 */
export const clear = (color) => {
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
export const drawLine = (x1, y1, x2, y2, color) => {
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

/**
 * Function for circle-generation using Bresenham's algorithm.
 * 
 * @param {number} xc The center x-value of the circle.
 * @param {number} yc The center y-value of the circle.
 * @param {number} r The radius of the circle.
 * @param {Color} c The color of the circle.
 */
export const drawCircle = (xc, yc, r, c) => {
  xc = Math.floor(xc);
  yc = Math.floor(yc);
  r = Math.floor(r);
  
  const drawOctants = (x, y) => {
    setPixel(xc + x, yc + y, c);
    setPixel(xc - x, yc + y, c);
    setPixel(xc + x, yc - y, c);
    setPixel(xc - x, yc - y, c);
    setPixel(xc + y, yc + x, c);
    setPixel(xc - y, yc + x, c);
    setPixel(xc + y, yc - x, c);
    setPixel(xc - y, yc - x, c);
  }

  let x = 0, y = r;
  let d = 3 - 2 * r;
  drawOctants(x, y);
  while (y >= x) {
    // For each pixel we will draw all eight pixels.
    x++;

    // Check for decision parameter and correspondingly update d, x, y.
    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
    } else {
      d = d + 4 * x + 6;
    }
    drawOctants(x, y);
  }
}

export const fillRect = (x, y, w, h, color) => {
  for (let yd = 0; yd < h; yd++) {
    for (let xd = 0; xd < w; xd++) {
      setPixel(x + xd, y + yd, color);
    }
  }
}

/**
 * Write a single pixel to the pixel buffer.
 * This change will not be visible until the next `postRender` call.
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {Color} color 
 */
export const setPixel = (x, y, color) => {
  const offset = getOffset(x, y);
  context.pixels[offset + 0] = color.r;
  context.pixels[offset + 1] = color.g;
  context.pixels[offset + 2] = color.b;
  context.pixels[offset + 3] = color.a;
};

/**
 * At the end of a render frame, write the pixel buffer to the 2d canvas context.
 */
export const postRender = () => {
  // Write the image data in `context.pixels` to the 2d canvas context in context.ctx2d.
  context.ctx2d.putImageData(new ImageData(context.pixels, context.width, context.height), 0, 0);
};

/**
 * On initial load, and on every resize, recalculate the size and position of the render canvas
 * to match the requested aspect ratio.
 */
const onResize = () => {
  const aspectRatio = context.canvas.width / context.canvas.height;
  const heightFromWidth = window.innerWidth / aspectRatio;
  const widthFromHeight = window.innerHeight * aspectRatio;

  let offsetX = 0;
  let offsetY = 0;
  if (window.innerWidth > widthFromHeight) {
    offsetX = (window.innerWidth - widthFromHeight) / 2;
  } else if (window.innerHeight > heightFromWidth) {
    offsetY = (window.innerHeight - heightFromWidth) / 2;
  }

  context.canvas.style.inset = `${offsetY}px ${offsetX}px`;
  context.canvas.style.width = `calc(100% - ${offsetX * 2}px)`
  context.canvas.style.height = `calc(100% - ${offsetY * 2}px)`
};

/**
 * Create the canvas and 2D context.  Setup some event handlers.
 * 
 * @param {number} width The width of the display canvas in pixels.
 * @param {number} height The height of the display canvas in pixels.
 */
export const createContext = async (width, height) => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  
  canvas.width = width;
  canvas.height = height;

  const ctx2d = canvas.getContext('2d', {
    antialias: false,
  });
  if (!ctx2d) throw new Error('Unable to acquire the 2d context.');

  const bpp = 4;
  const stride = width * bpp;
  const pixels = new Uint8ClampedArray(stride * height);

  context = {
    canvas,
    width,
    height,
    bpp,
    stride,
    pixels,
    ctx2d,
  };
  
  onResize();
  window.addEventListener('resize', onResize);
};

/**
 * Convert canvas coordinates into virtual screen coordinates.
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns {x: number, y: number} An object with the converted x and y properties.
 */
export const convertPosition = (x, y) => {
    const rect = context.canvas.getBoundingClientRect();

    const displayWidth = context.canvas.clientWidth;
    const displayHeight = context.canvas.clientHeight;
    let drawWidth = 0;
    let drawHeight = 0;
    if (displayWidth > displayHeight) {
        // Most of the time the window will be horizontal.
        drawHeight = displayHeight;
        drawWidth = context.width * drawHeight / context.height;
    } else {
        // Sometimes the window will be vertical.
        drawWidth = displayWidth;
        drawHeight = context.height * drawWidth / context.width;
    }

    rect.x += (displayWidth - drawWidth) / 2;
    rect.y += (displayHeight - drawHeight) / 2;
    rect.width = drawWidth;
    rect.height = drawHeight;

    const newX = Math.floor((x - rect.left) / rect.width * context.width);
    const newY = Math.floor((y - rect.top) / rect.height * context.height);

    return { x: newX, y: newY };
}
