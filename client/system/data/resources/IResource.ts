export default interface IResource {
  loadContent(props: unknown): Promise<unknown>;
}
