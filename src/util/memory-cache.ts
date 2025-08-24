


type CacheEntry<V> = {
  value?: V;
  expiresAt: number;
  pending?: Promise<V>;
};

/**
 * Simple in-memory cache with TTL and in-flight request de-duplication.
 * - Stores values by string keys.
 * - getOrSet will use the cached value if fresh; otherwise it will call the fetcher,
 *   cache the result, and return it. Concurrent calls share the same in-flight Promise.
 */
export class MemoryCache<V = unknown> {
  private store = new Map<string, CacheEntry<V>>();

  /** Get a value if present and not expired, otherwise undefined */
  get(key: string): V | undefined {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt > now && entry.value !== undefined) {
      return entry.value;
    }
    return undefined;
  }

  /** Set a value with TTL in milliseconds */
  set(key: string, value: V, ttlMs: number): void {
    const expiresAt = Date.now() + Math.max(0, ttlMs);
    this.store.set(key, { value, expiresAt });
  }

  /** True if key exists and is not expired */
  has(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);
    return !!(entry && entry.expiresAt > now && entry.value !== undefined);
  }

  /** Remove a key from the cache */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /** Clear the entire cache */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get the cached value if fresh; otherwise, fetch a new one using fetcher, cache it, and return it.
   * Concurrent callers for the same key will await the same in-flight fetch.
   */
  async getOrSet(key: string, ttlMs: number, fetcher: () => Promise<V>): Promise<V> {
    const now = Date.now();
    const existing = this.store.get(key);

    if (existing && existing.expiresAt > now && existing.value !== undefined) {
      return existing.value;
    }

    if (existing?.pending) {
      return existing.pending;
    }

    const pending = (async () => {
      try {
        const value = await fetcher();
        this.set(key, value, ttlMs);
        return value;
      } finally {
        // Clear pending after resolution to allow future refreshes
        const e = this.store.get(key);
        if (e && e.pending) {
          this.store.set(key, { value: e.value, expiresAt: e.expiresAt });
        }
      }
    })();

    this.store.set(key, { value: existing?.value, expiresAt: existing?.expiresAt ?? 0, pending });
    return pending;
  }
}