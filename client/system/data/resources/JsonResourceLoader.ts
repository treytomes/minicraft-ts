import IResourceLoader from './IResourceLoader';

export default class JsonResourceLoader implements IResourceLoader<unknown> {
  readonly exts = ['json'];

  async load(path: string): Promise<unknown> {
    const response = await fetch(path);
    const json = await response.json();
    return json;
  }
}
