// Setup a unit quad composed of 2 triangles for rendering the framebuffer to the canvas.
const FRAMEBUFFER_POSITIONS = new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1])

/**
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
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {{r: number, g: number, b: number}} color 
 */
export const setPixel = (x, y, color) => {
  const offset = getOffset(x, y)
  context.pixels[offset + 0] = color.r
  context.pixels[offset + 1] = color.g
  context.pixels[offset + 2] = color.b
  context.pixels[offset + 3] = 255
}

/**
 * 
 * @param {number} time 
 */
export const postRender = (time) => {
  // Write the image data in `context.pixels` to the 2d canvas context in context.ctx2d.
  context.ctx2d.putImageData(new ImageData(context.pixels, context.width, context.height), 0, 0);
}

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

  context.canvas.style.top = `${offsetY}px`;
  context.canvas.style.bottom = `${offsetY}px`;
  context.canvas.style.left = `${offsetX}px`;
  context.canvas.style.right = `${offsetX}px`;
  context.canvas.style.width = `calc(100% - ${offsetX * 2}px)`;
  context.canvas.style.height = `calc(100% - ${offsetY * 2}px)`;
}

/**
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
}