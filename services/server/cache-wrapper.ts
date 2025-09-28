import { LRUCache } from "lru-cache";

export interface ICacheWrapperOptions {
  max: number;
  ttl: number;
}

export function createCacheWrapper<TResponse>(options: ICacheWrapperOptions) {
  const cache = new LRUCache<string, { value: TResponse }>({
    max: options.max,
    ttl: options.ttl,
  });

  const withCache = async <TArgs extends unknown[]>(
    fetcher: (...args: TArgs) => Promise<TResponse>,
    ...args: TArgs
  ): Promise<TResponse> => {
    const key = JSON.stringify(args)
    const cacheItem = cache.get(key);

    if (cacheItem) {
      return cacheItem.value;
    }

    const result = await fetcher(...args);
    cache.set(key, { value: result });

    return result;
  };

  return {
    cache,
    withCache,
  };
}
