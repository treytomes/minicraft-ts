// Setup a unit quad composed of 2 triangles for rendering the framebuffer to the canvas.
const FRAMEBUFFER_POSITIONS = new Float32Array([1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1])

/**
 * @type {{
 *          canvas: HTMLCanvasElement,
 *          width: number,
 *          height: number,
 *          bpp: number,
 *          stride: number,
 *          pixels: Uint8Array,
 *          gl: WebGL2RenderingContext,
 *          texture: WebGLTexture,
 *          shaderProgram: WebGLProgram,
 *          vertexBuffer: WebGLVertexArrayObject,
 *          shaderParams: {
 *            targetScreenSizeLocation: WebGLUniformLocation,
 *            actualScreenSizeLocation: WebGLUniformLocation,
 *            renderTextureLocation: WebGLUniformLocation
 *          }
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
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @returns 
 */
export const createRenderTexture = (gl) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  if (!texture) throw new Error('Unable to create the render texture.')
  return texture
}

/**
 * 
 * @param {number} time 
 */
export const postRender = (time) => {
  const gl = context.gl
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, context.width, context.height, 0, gl.RGB, gl.UNSIGNED_BYTE, context.pixels)
  
  // gl.uniform1f(context.shaderParams.timeLocation, time)

  gl.uniform2f(context.shaderParams.actualScreenSizeLocation, context.canvas.clientWidth, context.canvas.clientHeight)

  // Draw the image data to the frame buffer.
  gl.drawArrays(gl.TRIANGLES, 0, FRAMEBUFFER_POSITIONS.length / 2)
}

/**
 * 
 * @param {number} width The width of the display canvas in pixels.
 * @param {number} height The height of the display canvas in pixels.
 */
export const createContext = async (width, height) => {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)

  const gl = canvas.getContext('webgl2', {
    antialias: false,
  })
  if (!gl) throw new Error('Unable to acquire the webgl2 context.')

  // Create the render texture.
  const texture = createRenderTexture(gl)

  // Create the shader program.
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  if (!vertexShader) throw new Error('Unable to create vertex shader.')
  gl.shaderSource(vertexShader, await fetch('./canvas.vs').then((response) => response.text()))
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  if (!fragmentShader) throw new Error('Unable to create fragment shader.')
  gl.shaderSource(fragmentShader, await fetch('./canvas.fs').then((response) => response.text()))
  gl.compileShader(fragmentShader)

  const shaderProgram = gl.createProgram()
  if (!shaderProgram) throw new Error('Unable to create shader program.')
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Failed to link shader program: ', gl.getProgramInfoLog(shaderProgram))
  }

  // Activate the shader.
  gl.useProgram(shaderProgram)

  // const timeLocation = gl.getUniformLocation(shaderProgram, 'time')
  // if (!timeLocation) throw new Error('Unable to locate time.')
  // gl.uniform1f(timeLocation, 0.0);

  const targetScreenSizeLocation = gl.getUniformLocation(shaderProgram, 'target_screen_size')
  if (!targetScreenSizeLocation) throw new Error('Unable to locate target_screen_size.')
  gl.uniform2f(targetScreenSizeLocation, width, height);

  const actualScreenSizeLocation = gl.getUniformLocation(shaderProgram, 'actual_screen_size')
  if (!actualScreenSizeLocation) throw new Error('Unable to locate actual_screen_size.')
  gl.uniform2f(actualScreenSizeLocation, canvas.width, canvas.height);

  const renderTextureLocation = gl.getUniformLocation(shaderProgram, 'render_texture')
  if (!renderTextureLocation) throw new Error('Unable to locate render_texture.')
  gl.uniform1i(renderTextureLocation, 0);

  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) throw new Error('Unable to create vertex buffer.')
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, FRAMEBUFFER_POSITIONS, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const bpp = 3;
  const stride = width * bpp;
  const pixels = new Uint8Array(stride * height);

  context = {
    canvas,
    width,
    height,
    bpp,
    stride,
    pixels,
    gl,
    texture,
    shaderProgram,
    vertexBuffer,
    shaderParams: {
      actualScreenSizeLocation,
      renderTextureLocation,
      targetScreenSizeLocation,
    },
  }
}