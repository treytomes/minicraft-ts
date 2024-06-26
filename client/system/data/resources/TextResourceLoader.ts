import IResourceLoader from './IResourceLoader';

export default class TextResourceLoader implements IResourceLoader<string> {
  readonly exts = ['txt'];

  async load(path: string): Promise<string> {
    const response = await fetch(path);
    const text = await response.text();
    return text;
  }
}
