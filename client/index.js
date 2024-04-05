import {SCREEN_WIDTH, SCREEN_HEIGHT, createContext, postRender, setPixel} from './system/index.js'

const render = (time) => {
  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      setPixel(x, y, { r: x ^ y, g: x & y, b: x | y })
    }
  }
  
  setPixel(100, 100, { r: 255, g: 255, b: 0 })
}

let lastUpdateTime = 0
const UPDATE_INTERVAL = 1000
const onRenderFrame = (time) => {
  if (time - lastUpdateTime >= UPDATE_INTERVAL) {
    console.log('Update!')
    lastUpdateTime = time
  }

  render(time)

  postRender(time)

  requestAnimationFrame(onRenderFrame)
}

const onWindowLoad = async () => {
  // const information = document.getElementById('info');
  // information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;

  console.log('Here we go.')
  console.log(await window.versions.ping());

  await createContext();

  // Begin the render loop.
  requestAnimationFrame(onRenderFrame)
}

window.addEventListener('load', onWindowLoad, false)
