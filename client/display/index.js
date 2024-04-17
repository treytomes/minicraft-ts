import { css } from '../util/index.js';

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

export class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255;
  }
};

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

  context.canvas.style.top = css.pixels(offsetY);
  context.canvas.style.bottom = css.pixels(offsetY);
  context.canvas.style.left = css.pixels(offsetX);
  context.canvas.style.right = css.pixels(offsetX);
  context.canvas.style.width = css.subtract(css.percent(1), css.pixels(offsetX * 2));
  context.canvas.style.height = css.subtract(css.percent(1), css.pixels(offsetY * 2));
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
  }
  
  onResize();
  window.addEventListener('resize', onResize);
};
