import IResource from './IResource';

export default abstract class Resource<TResourceProps> implements IResource {
  async loadContent(props: unknown): Promise<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async loadContent(props: TResourceProps) {}
}
