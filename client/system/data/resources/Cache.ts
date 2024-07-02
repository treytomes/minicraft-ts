export default class Cache {
  private _cache: {[key: string]: unknown} = {};

  public get<TResource>(key: string): TResource {
    return this._cache[key] as TResource;
  }

  public set<TResource>(key: string, value: TResource): void {
    this._cache[key] = value;
  }

  public remove(key: string): void {
    delete this._cache[key];
  }

  public clear(): void {
    this._cache = {};
  }
}
