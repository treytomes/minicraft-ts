import {getHeight, getWidth} from '../display';
import {MouseEventProxy} from '../input';
import {Rectangle} from '../math';
import UIElement from './UIElement';

export default class RootElement extends UIElement {
  constructor() {
    super(new Rectangle(0, 0, getWidth(), getHeight()));
  }

  onKeyDown(e: KeyboardEvent) {
    if (UIElement.KEYBOARD_FOCUS !== this) {
      UIElement.KEYBOARD_FOCUS?.onKeyDown(e);
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (UIElement.KEYBOARD_FOCUS !== this) {
      UIElement.KEYBOARD_FOCUS?.onKeyUp(e);
    }
  }

  onMouseDown(e: MouseEventProxy) {
    // Is the left mouse button pressed?
    if (e.button === 0) {
      UIElement.MOUSE_FOCUS = undefined;
      if (UIElement.MOUSE_HOVER !== this) {
        UIElement.MOUSE_HOVER?.onMouseDown(e);
      }
    }
  }

  onMouseUp(e: MouseEventProxy) {
    if (e.button === 0) {
      if (UIElement.MOUSE_FOCUS !== this) {
        UIElement.MOUSE_FOCUS?.onMouseUp(e);
      }
    }
  }
}
