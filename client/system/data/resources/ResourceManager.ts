import Cache from './Cache';
import IBaseResourceLoader from './IBaseResourceLoader';
import IResourceLoader from './IResourceLoader';
import ImageResourceLoader from './ImageResourceLoader';
import TextResourceLoader from './TextResourceLoader';

const DEFAULT_FILE_TYPE = 'txt';
export class ResourceManager {
  private readonly cache = new Cache();
  private readonly loaders: {[fileType: string]: IBaseResourceLoader} = {};

  static initialize() {
    window.resources = new ResourceManager();
    window.resources.registerLoader(new TextResourceLoader());
    window.resources.registerLoader(new ImageResourceLoader());
  }

  registerLoader<TResource>(loader: IResourceLoader<TResource>): void {
    for (let n = 0; n < loader.exts.length; n++) {
      this.loaders[loader.exts[n]] = loader;
    }
  }

  loadResource<TResource>(path: string): TResource {
    const existingValue = this.cache.get<TResource>(path);
    if (existingValue) return existingValue;

    const fileType = path.split('.').pop() ?? DEFAULT_FILE_TYPE;
    const loader = this.loaders[fileType] as IResourceLoader<TResource>;
    const resource = loader.load(path) as TResource;

    if (!resource) {
      throw new Error(`Failed to load resource: ${path}`);
    }

    this.cache.set(path, resource);
    return resource;
  }
}
