import NodeCache from 'node-cache';
import assert from 'node:assert';

class CacheHandler {
  // Should cache things for an hour
  private readonly cache: NodeCache = new NodeCache({ stdTTL: 1 * 60 * 60, maxKeys: -1, checkperiod: 180 });

  set<T>(key: string, value: T): T {
    this.cache.set<T>(key, value);
    const cached = this.get<T>(key);
    assert(cached);
    return cached;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  keys(): string[] {
    return this.cache.keys();
  }

  size(): number {
    return this.cache.keys().length;
  }

  clear(): void {
    this.cache.flushAll();
  }
}

export default CacheHandler;
