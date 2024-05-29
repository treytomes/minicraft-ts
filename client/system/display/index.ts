import Color from './Color';
import Sprite from './Sprite';
import TileSet, {BIT_MIRROR_X, BIT_MIRROR_Y} from './TileSet';
import Font from './Font';
import {PALETTE} from './palette';

export {Color, Font, Sprite, TileSet, BIT_MIRROR_X, BIT_MIRROR_Y, PALETTE};

type RenderingContext = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  bpp: number;
  stride: number;
  pixels: Uint8ClampedArray;
  ctx2d: CanvasRenderingContext2D;
};

/**
 * Container for the details necessary to render to the screen.
 */
export let context: RenderingContext;

export const getWidth = (): number => context.width;
export const getHeight = (): number => context.height;
export const getOffset = (x: number, y: number): number =>
  (y * context.width + x) * context.bpp;

/**
 * Clear the screen to a color.
 *
 * @param {Color} color The color to clear to.
 */
export const clear = (color: Color) => {
  for (let y = 0; y < getHeight(); y++) {
    for (let x = 0; x < getWidth(); x++) {
      setPixel(x, y, color);
    }
  }
};

/**
 * Fill a region with a color.
 */
export const floodFill = (x: number, y: number, c: Color) => {
  const queue: [number, number][] = [];

  // This is the source color we are replacing.
  const sourceColor = getPixel(x, y);

  // Is it in range?  Does it match our source color?
  const isValid = (xp: number, yp: number) =>
    xp >= 0 &&
    xp < getWidth() &&
    yp >= 0 &&
    yp < getHeight() &&
    getPixel(xp, yp).equals(sourceColor);

  // Push the origin onto the queue.
  queue.push([x, y]);

  while (queue.length > 0) {
    const currPixel = queue.pop()!;

    const posX = currPixel[0];
    const posY = currPixel[1];
    setPixel(posX, posY, c);

    if (isValid(posX + 1, posY)) queue.push([posX + 1, posY]);
    if (isValid(posX - 1, posY)) queue.push([posX - 1, posY]);
    if (isValid(posX, posY + 1)) queue.push([posX, posY + 1]);
    if (isValid(posX, posY - 1)) queue.push([posX, posY - 1]);
  }
};

/**
 * @param {number} xc Center point along the x-axis.
 * @param {number} yc Center point along the y-axis.
 * @param {number} rx Radius along the x-axis.
 * @param {number} ry Radius along the y-axis.
 * @param {Color} c The color to use.
 * @param {boolean} filled Should the interior of the circle be filled in?
 */
export const drawEllipse = (
  xc: number,
  yc: number,
  rx: number,
  ry: number,
  c: Color,
  filled = false
) => {
  // Draw points based on 4-way symmetry.
  const drawQuadrants = (x: number, y: number) => {
    if (filled) {
      for (let xx = xc - x; xx <= xc + x; xx++) {
        setPixel(xx, yc + y, c);
        setPixel(xx, yc - y, c);
      }
    } else {
      setPixel(x + xc, y + yc, c);
      setPixel(-x + xc, y + yc, c);

      setPixel(x + xc, -y + yc, c);
      setPixel(-x + xc, -y + yc, c);
    }
  };

  xc = Math.floor(xc);
  yc = Math.floor(yc);
  rx = Math.floor(rx);
  ry = Math.floor(ry);

  if (rx === ry) {
    // An ellipse collapses into a circle if both radii are equal.
    drawCircle(xc, yc, rx, c, filled);
    return;
  }

  let x = 0;
  let y = ry;

  // Initial decision parameter of region 1.
  let d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
  let dx = 2 * ry * ry * x;
  let dy = 2 * rx * rx * y;

  // For region 1
  while (dx < dy) {
    drawQuadrants(x, y);

    // Checking and updating value of decision parameter based on algorithm
    if (d1 < 0) {
      x++;
      dx = dx + 2 * ry * ry;
      d1 = d1 + dx + ry * ry;
    } else {
      x++;
      y--;
      dx = dx + 2 * ry * ry;
      dy = dy - 2 * rx * rx;
      d1 = d1 + dx - dy + ry * ry;
    }
  }

  // Decision parameter of region 2
  let d2 =
    ry * ry * ((x + 0.5) * (x + 0.5)) +
    rx * rx * ((y - 1) * (y - 1)) -
    rx * rx * ry * ry;

  // Plotting points of region 2
  while (y >= 0) {
    drawQuadrants(x, y);

    // Checking and updating parameter value based on algorithm
    if (d2 > 0) {
      y--;
      dy = dy - 2 * rx * rx;
      d2 = d2 + rx * rx - dy;
    } else {
      y--;
      x++;
      dx = dx + 2 * ry * ry;
      dy = dy - 2 * rx * rx;
      d2 = d2 + dx - dy + rx * rx;
    }
  }
};

/**
 * Function for circle-generation using Bresenham's algorithm.
 *
 * @param {number} xc The center x-value of the circle.
 * @param {number} yc The center y-value of the circle.
 * @param {number} r The radius of the circle.
 * @param {Color} c The color of the circle.
 * @param {boolean} filled Should the interior of the circle be filled in?
 */
export const drawCircle = (
  xc: number,
  yc: number,
  r: number,
  c: Color,
  filled = false
) => {
  xc = Math.floor(xc);
  yc = Math.floor(yc);
  r = Math.floor(r);

  const drawOctants = (x: number, y: number) => {
    setPixel(xc + x, yc + y, c);
    setPixel(xc - x, yc + y, c);
    setPixel(xc + x, yc - y, c);
    setPixel(xc - x, yc - y, c);

    setPixel(xc + y, yc + x, c);
    setPixel(xc - y, yc + x, c);
    setPixel(xc + y, yc - x, c);
    setPixel(xc - y, yc - x, c);
  };

  const fillOctants = (x: number, y: number) => {
    for (let xx = xc - x; xx <= xc + x; xx++) setPixel(xx, yc + y, c);
    for (let xx = xc - x; xx <= xc + x; xx++) setPixel(xx, yc - y, c);

    for (let xx = xc - y; xx <= xc + y; xx++) setPixel(xx, yc + x, c);
    for (let xx = xc - y; xx <= xc + y; xx++) setPixel(xx, yc - x, c);
  };

  let x = 0,
    y = r;
  let d = 3 - 2 * r;
  filled ? fillOctants(x, y) : drawOctants(x, y);
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
    filled ? fillOctants(x, y) : drawOctants(x, y);
  }
};

/**
 * Draw an arbitrary line across the screen.
 *
 * @param {number} x1 The starting x-value.
 * @param {number} y1 The starting y-value.
 * @param {number} x2 The ending x-value.
 * @param {number} y2 The ending y-value.
 * @param {{r: number, g: number, b: number}} color The line color.
 */
export const drawLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: Color
) => {
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
    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;
    let dy = Math.abs(y2 - y1);
    dy = -dy;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx + dy;

    /* eslint-disable no-constant-condition */
    while (true) {
      setPixel(x1, y1, color);
      if (x1 === x2 && y1 === y2) break;
      const e2 = err << 1;
      if (e2 >= dy) {
        if (x1 === x2) break;
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
};

export const fillRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color: Color
) => {
  for (let yd = 0; yd < h; yd++) {
    if (y + yd < 0) continue;
    if (y + yd >= getHeight()) break;

    for (let xd = 0; xd < w; xd++) {
      if (x + xd < 0) continue;
      if (x + xd >= getWidth()) break;

      setPixel(x + xd, y + yd, color);
    }
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
export const setPixel = (x: number, y: number, color: Color) => {
  if (x < 0 || y < 0 || x >= getWidth() || y >= getHeight()) return;
  const offset = getOffset(x, y);
  context.pixels[offset + 0] = color.r;
  context.pixels[offset + 1] = color.g;
  context.pixels[offset + 2] = color.b;
  context.pixels[offset + 3] = color.a;
};

export const getPixel = (x: number, y: number) => {
  const offset = getOffset(x, y);
  return new Color(
    context.pixels[offset + 0],
    context.pixels[offset + 1],
    context.pixels[offset + 2]
  );
};

/**
 * At the end of a render frame, write the pixel buffer to the 2d canvas context.
 */
export const postRender = () => {
  // Write the image data in `context.pixels` to the 2d canvas context in context.ctx2d.
  // TODO: Can I avoid rebuilding ImageDAta on each frame.
  context.ctx2d.putImageData(
    new ImageData(context.pixels, context.width, context.height),
    0,
    0
  );
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
  context.canvas.style.width = `calc(100% - ${offsetX * 2}px)`;
  context.canvas.style.height = `calc(100% - ${offsetY * 2}px)`;
};

/**
 * Create the canvas and 2D context.  Setup some event handlers.
 *
 * @param {number} width The width of the display canvas in pixels.
 * @param {number} height The height of the display canvas in pixels.
 */
export const createContext = async (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.width = width;
  canvas.height = height;

  const ctx2d = canvas.getContext('2d', {
    antialias: false,
  }) as CanvasRenderingContext2D;
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
export const convertPosition = (
  x: number,
  y: number
): {x: number; y: number} => {
  const rect = context.canvas.getBoundingClientRect();

  const displayWidth = context.canvas.clientWidth;
  const displayHeight = context.canvas.clientHeight;
  let drawWidth = 0;
  let drawHeight = 0;
  if (displayWidth > displayHeight) {
    // Most of the time the window will be horizontal.
    drawHeight = displayHeight;
    drawWidth = (context.width * drawHeight) / context.height;
  } else {
    // Sometimes the window will be vertical.
    drawWidth = displayWidth;
    drawHeight = (context.height * drawWidth) / context.width;
  }

  rect.x += (displayWidth - drawWidth) / 2;
  rect.y += (displayHeight - drawHeight) / 2;
  rect.width = drawWidth;
  rect.height = drawHeight;

  const newX = Math.floor(((x - rect.left) / rect.width) * context.width);
  const newY = Math.floor(((y - rect.top) / rect.height) * context.height);

  return {x: newX, y: newY};
};
