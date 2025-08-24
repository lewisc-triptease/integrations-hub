import { describe, it, expect, mock } from "bun:test";

let calls = {
  meta: 0,
  values: 0,
};

mock.module("googleapis", () => {
  return {
    google: {
      sheets: ({ auth }: { auth: any }) => {
        return {
          spreadsheets: {
            get: async ({ spreadsheetId, fields }: { spreadsheetId: string; fields: string }) => {
              calls.meta++;
              return {
                data: {
                  sheets: [
                    { properties: { sheetId: 123, title: "Sheet One" } },
                    { properties: { sheetId: 456, title: "Sheet Two" } },
                  ],
                },
              } as any;
            },
            values: {
              get: async ({ spreadsheetId, range }: { spreadsheetId: string; range: string }) => {
                calls.values++;
                return {
                  data: {
                    values: [
                      ["header1", "header2"],
                      ["a", "b"],
                    ],
                  },
                } as any;
              },
            },
          },
        } as any;
      },
      auth: {
        GoogleAuth: class FakeGoogleAuth {
          scopes: string[];
          constructor(opts: any) { this.scopes = opts?.scopes ?? []; }
          async getClient() { return { token: "fake-client" }; }
        },
      },
    },
  } as any;
});

import { fetchIntegrationConfigsViaApi } from "../../../src/data-source/google/download.js";
import { MemoryCache } from "../../../src/util/memory-cache.js";

async function withMockedNow<T>(start: number, fn: (advance: (ms: number) => void) => T | Promise<T>): Promise<T> {
  const realNow = Date.now;
  let current = start;
  Date.now = () => current;
  try {
    const advance = (ms: number) => { current += ms; };
    const result = fn(advance) as any;
    if (result && typeof result.then === "function") {
      return await result;
    }
    return result as T;
  } finally {
    Date.now = realNow;
  }
}

describe("fetchIntegrationConfigsViaApi cache behavior", () => {
  it("performs a single underlying fetch for sequential calls within TTL", async () => {
    await withMockedNow(0, async () => {
      calls = { meta: 0, values: 0 };
      const spreadsheetId = "SPREADSHEET";
      const gid = String(123);

      const cache = new MemoryCache<any>();
      const r1 = await fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache });
      const r2 = await fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache });

      expect(Array.isArray(r1)).toBeTrue();
      expect(r1).toEqual(r2);
      expect(calls.meta).toBe(1);
      expect(calls.values).toBe(1);
    });
  });

  it("re-fetches after TTL expiry (15 minutes)", async () => {
    await withMockedNow(0, async (advance) => {
      calls = { meta: 0, values: 0 };
      const spreadsheetId = "SPREADSHEET";
      const gid = String(456);

      const cache = new MemoryCache<any>();
      await fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache });
      expect(calls.meta).toBe(1);
      expect(calls.values).toBe(1);

      advance(899_999);
      await fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache });
      expect(calls.meta).toBe(1);
      expect(calls.values).toBe(1);

      advance(2);
      await fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache });
      expect(calls.meta).toBe(2);
      expect(calls.values).toBe(2);
    });
  });

  it("de-duplicates concurrent calls to a single in-flight fetch", async () => {
    await withMockedNow(0, async () => {
      calls = { meta: 0, values: 0 };
      const spreadsheetId = "SPREADSHEET";
      const gid = String(123);

      const cache = new MemoryCache<any>();
      const [a, b, c] = await Promise.all([
        fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache }),
        fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache }),
        fetchIntegrationConfigsViaApi(spreadsheetId, gid, undefined, { cache }),
      ]);

      expect(a).toEqual(b);
      expect(b).toEqual(c);
      expect(calls.meta).toBe(1);
      expect(calls.values).toBe(1);
    });
  });
});
