import Cache from './Cache';
import IBaseResourceLoader from './IBaseResourceLoader';
import IResourceLoader from './IResourceLoader';
import ImageResourceLoader from './ImageResourceLoader';
import SoundResourceLoader from './SoundResourceLoader';
import TextResourceLoader from './TextResourceLoader';

const DEFAULT_FILE_TYPE = 'txt';

export class ResourceManager {
  private readonly assetRoot: string;
  private readonly cache = new Cache();
  private readonly loaders: {[fileType: string]: IBaseResourceLoader} = {};

  static initialize(assetRoot: string) {
    window.resources = new ResourceManager(assetRoot);
    window.resources.register(new ImageResourceLoader());
    window.resources.register(new SoundResourceLoader());
    window.resources.register(new TextResourceLoader());
  }

  constructor(assetRoot: string) {
    this.assetRoot = assetRoot;
  }

  register<TResource>(loader: IResourceLoader<TResource>): void {
    for (let n = 0; n < loader.exts.length; n++) {
      this.loaders[loader.exts[n]] = loader;
    }
  }

  async load<TResource>(path: string): Promise<TResource> {
    const existingValue = this.cache.get<TResource>(path);
    if (existingValue) return existingValue;

    path = `${this.assetRoot}/${path}`;
    const fileType = path.split('.').pop() ?? DEFAULT_FILE_TYPE;
    const loader = this.loaders[fileType] as IResourceLoader<TResource>;
    const resource = (await loader.load(path)) as TResource;

    if (!resource) {
      throw new Error(`Failed to load resource: ${path}`);
    }

    this.cache.set(path, resource);
    return resource;
  }
}
