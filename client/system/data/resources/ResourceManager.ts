import Cache from './Cache';
import IBaseResourceLoader from './IBaseResourceLoader';
import IResource from './IResource';
import IResourceLoader from './IResourceLoader';
import ImageResourceLoader from './ImageResourceLoader';
import JsonResourceLoader from './JsonResourceLoader';
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
    window.resources.register(new JsonResourceLoader());
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

  async load<TResource extends IResource>(
    type: {new (): TResource},
    path: string
  ): Promise<TResource> {
    const existingValue = this.cache.get<TResource>(path);
    if (existingValue) return existingValue;

    // path = `${this.assetRoot}/${path}`;
    const fileType = path.split('.').pop() ?? DEFAULT_FILE_TYPE;
    const loader = this.loaders[fileType] as IResourceLoader<TResource>;
    let resource = await loader.load(`${this.assetRoot}/${path}`);
    if (loader instanceof JsonResourceLoader) {
      const props = resource;
      resource = new type();
      await resource.loadContent(props);
    }

    if (!resource) {
      throw new Error(`Failed to load resource: ${path}`);
    }

    this.cache.set(path, resource);
    return resource as TResource;
  }
}
