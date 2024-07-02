import {Registry} from './Registry';

export class EventBus extends EventTarget {
  static initialize() {
    window.events = new EventBus();
  }

  register = <DetailType>(
    type: string & {
      __detail: DetailType;
    },
    callback: (e: DetailType) => void
  ): Registry => {
    const listener = (e: Event) => {
      const ce = e as CustomEvent<DetailType>;
      callback(ce.detail);
    };
    this.addEventListener(type, listener);

    return {
      unregister: () => {
        this.removeEventListener(type, listener);
      },
    };
  };

  dispatch = async <DetailType>(
    type: string & {
      __detail: DetailType;
    },
    detail: DetailType
  ) => {
    this.dispatchEvent(new CustomEvent(type, {detail}));
  };
}
