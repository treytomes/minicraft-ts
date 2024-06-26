import {Sound} from '../../audio/Sound';
import IResourceLoader from './IResourceLoader';

export default class SoundResourceLoader implements IResourceLoader<Sound> {
  readonly exts = ['wav'];

  async load(path: string): Promise<Sound> {
    // TODO: Why can't I load the array buffer and pass that to the sound object?
    // The program crashes catastrophically every time.
    const sound = new Sound(path);
    return Promise.resolve(sound);
  }

  // async load(path: string): Promise<Sound> {
  //   const response = await fetch(path);
  //   const buffer = await response.arrayBuffer();
  //   const sound = new Sound();
  //   await sound.loadContent(buffer);
  //   return Promise.resolve(sound);
  // }
}
