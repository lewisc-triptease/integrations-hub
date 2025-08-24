type CacheEntry<V> = {
  value?: V;
  expiresAt: number;
  pending?: Promise<V>;
};

export class MemoryCache<V = unknown> {
  private store = new Map<string, CacheEntry<V>>();

  get(key: string): V | undefined {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt > now && entry.value !== undefined) {
      return entry.value;
    }
    return undefined;
  }

  set(key: string, value: V, ttlMs: number): void {
    const expiresAt = Date.now() + Math.max(0, ttlMs);
    this.store.set(key, { value, expiresAt });
  }

  has(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);
    return !!(entry && entry.expiresAt > now && entry.value !== undefined);
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

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