import {Sound} from '../../audio/Sound';
import IResourceLoader from './IResourceLoader';

export default class SoundResourceLoader implements IResourceLoader<Sound> {
  readonly exts = ['wav'];

  async load(path: string): Promise<Sound> {
    const sound = new Sound(path);
    return Promise.resolve(sound);
  }
}
