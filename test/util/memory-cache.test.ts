import { describe, it, expect } from "bun:test";
import { MemoryCache } from "../../src/util/memory-cache.js";

// Helper to mock Date.now in a scoped way
async function withMockedNow<T>(start: number, fn: (advance: (ms: number) => void) => T | Promise<T>): Promise<T> {
  const realNow = Date.now;
  let current = start;
  // @ts-ignore
  Date.now = () => current;
  try {
    const advance = (ms: number) => { current += ms; };
    // @ts-ignore
    const result = fn(advance);
    if (result && typeof (result as any).then === "function") {
      return await (result as any);
    }
    return result as T;
  } finally {
    Date.now = realNow;
  }
}

describe("MemoryCache basic operations", () => {
  it("set/get/has/invalidate/clear work as expected", () => {
    withMockedNow(1_000, () => {
      const cache = new MemoryCache<number>();
      expect(cache.get("a")).toBeUndefined();
      expect(cache.has("a")).toBeFalse();

      cache.set("a", 42, 1000);
      expect(cache.has("a")).toBeTrue();
      expect(cache.get("a")).toBe(42);

      cache.invalidate("a");
      expect(cache.has("a")).toBeFalse();
      expect(cache.get("a")).toBeUndefined();

      cache.set("b", 7, 1000);
      cache.set("c", 8, 1000);
      cache.clear();
      expect(cache.has("b")).toBeFalse();
      expect(cache.has("c")).toBeFalse();
    });
  });

  it("respects TTL and expires items after ttlMs", () => {
    withMockedNow(10_000, (advance) => {
      const cache = new MemoryCache<string>();
      cache.set("k", "v1", 500);
      expect(cache.get("k")).toBe("v1");
      advance(499);
      expect(cache.get("k")).toBe("v1");
      advance(1); // exactly at expiry
      expect(cache.get("k")).toBeUndefined();
      expect(cache.has("k")).toBeFalse();
    });
  });
});

describe("MemoryCache getOrSet behavior", () => {
  it("returns cached value if fresh", async () => {
    await withMockedNow(0, async (advance) => {
      const cache = new MemoryCache<number>();
      let calls = 0;
      const fetcher = async () => { calls++; return 1; };

      const v1 = await cache.getOrSet("key", 1000, fetcher);
      const v2 = await cache.getOrSet("key", 1000, fetcher);
      expect(v1).toBe(1);
      expect(v2).toBe(1);
      expect(calls).toBe(1);

      advance(999);
      const v3 = await cache.getOrSet("key", 1000, fetcher);
      expect(v3).toBe(1);
      expect(calls).toBe(1);

      advance(2); // move past expiry boundary to avoid edge cases
      const v4 = await cache.getOrSet("key", 1000, fetcher);
      expect(v4).toBe(1);
      expect(calls).toBe(2);
    });
  });

  it("de-duplicates concurrent in-flight fetches", async () => {
    await withMockedNow(0, async () => {
      const cache = new MemoryCache<number>();
      let calls = 0;

      let resolveFn: ((v: number) => void) | null = null;
      const fetcher = () => new Promise<number>((resolve) => {
        calls++;
        resolveFn = resolve;
      });

      const p1 = cache.getOrSet("key", 1000, fetcher);
      const p2 = cache.getOrSet("key", 1000, fetcher);
      const p3 = cache.getOrSet("key", 1000, fetcher);

      expect(calls).toBe(1); // only one fetch started

      // Resolve the single in-flight fetch
      resolveFn?.(123);

      const [a, b, c] = await Promise.all([p1, p2, p3]);
      expect(a).toBe(123);
      expect(b).toBe(123);
      expect(c).toBe(123);

      // Subsequent call should reuse cached value
      const v = await cache.getOrSet("key", 1000, async () => 999);
      expect(v).toBe(123);
      expect(calls).toBe(1);
    });
  });
});
