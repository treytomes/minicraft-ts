import Game from './Game';
import { convertPosition, postRender } from './display';

export * as display from './display';
export * as math from './math';
export * as html from './html';

type SystemContext = {
  game: Game | null,
  lastUpdateTime: number,
  lastRenderTime: number,
};

const systemContext: SystemContext = {
  game: null,
  lastUpdateTime: 0,
  lastRenderTime: 0,
};

export const initialize = (game: Game) => {
  systemContext.game = game;
  systemContext.lastUpdateTime = 0;
  systemContext.lastRenderTime = 0;
}

const UPDATE_INTERVAL = 1000 / 60;
const RENDER_INTERVAL = 1000 / 60;
const onFrame = (totalTime) => {
  if (totalTime - systemContext.lastUpdateTime >= UPDATE_INTERVAL) {
    const deltaTime = totalTime - systemContext.lastUpdateTime;
    const time = { deltaTime, totalTime: totalTime };
    systemContext.game?.update(time);
    systemContext.lastUpdateTime = totalTime;
  }

  if (totalTime - systemContext.lastRenderTime >= RENDER_INTERVAL) {
    const deltaTime = totalTime - systemContext.lastRenderTime;
    systemContext.game?.render({ deltaTime, totalTime: totalTime });
    postRender()
    systemContext.lastRenderTime = totalTime;
  }

  requestAnimationFrame(onFrame)
}

// Don't initialize anything until the document is ready.
document.addEventListener("DOMContentLoaded", async () => {
  await systemContext.game?.loadContent();

  console.log('Here we go.');
  console.log(await window.api.sample.ping());

  // window.addEventListener('onkeydown', onKeyDown);
  // window.addEventListener('onkeyup', onKeyUp);
  window.onkeydown = (e: KeyboardEvent) => systemContext.game?.onKeyDown(e);
  window.onkeyup = (e: KeyboardEvent) => systemContext.game?.onKeyUp(e);

  /**
   * @param {MouseEvent} e
   */
  window.addEventListener('mousemove', function (e) {
    const pos = convertPosition(e.clientX, e.clientY);
    systemContext.game?.onMouseMove({
      clientX: pos.x,
      clientY: pos.y,
      button: e.button,
      buttons: e.buttons,
    });
  });

  window.addEventListener('mousedown', function (e) {
    // console.log(e);
    const pos = convertPosition(e.clientX, e.clientY);
    systemContext.game?.onMouseDown({
      clientX: pos.x,
      clientY: pos.y,
      button: e.button,
      buttons: e.buttons,
    });
  });

  window.addEventListener('mouseup', function (e) {
    const pos = convertPosition(e.clientX, e.clientY);
    systemContext.game?.onMouseUp({
      clientX: pos.x,
      clientY: pos.y,
      button: e.button,
      buttons: e.buttons,
    });
  });

  // Unused events.  Might come back around to these later.

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
  requestAnimationFrame(onFrame)
});
