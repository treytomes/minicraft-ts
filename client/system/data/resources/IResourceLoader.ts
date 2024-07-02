import IBaseResourceLoader from './IBaseResourceLoader';

export default interface IResourceLoader<ResourceType>
  extends IBaseResourceLoader {
  load(path: string): Promise<ResourceType>;
}
