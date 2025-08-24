import { google } from "googleapis";
import { parseIntegrationConfigsFromRows } from './parse.js';
import { MemoryCache } from '../../util/memory-cache.js';

const sheetCache = new MemoryCache<any>();
const FIFTEEN_MIN_MS = 15 * 60 * 1000;

async function getSheetTitleByGid(auth: any, spreadsheetId: string, gid: string): Promise<string> {
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const meta = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets(properties(sheetId,title))",
    });
    const targetId = Number(gid);
    const match = meta.data.sheets?.find(s => s.properties?.sheetId === targetId);
    if (!match?.properties?.title) {
      throw new Error(`No sheet/tab with gid=${gid} found.`);
    }
    return match.properties.title;
  } catch (error: any) {
    console.error("Error getting sheet title:", error.message);
    console.error("Full error:", error);
    throw error;
  }
}

async function getValues(auth: any, spreadsheetId: string, sheetTitle: string): Promise<string[][]> {
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!A1:ZZ9999`,
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
      majorDimension: "ROWS",
    });
    const values = (res.data.values ?? []) as (string | number | boolean)[][];
    return values.map(row => row.map(v => (v == null ? "" : String(v))));
  } catch (error: any) {
    console.error("Error getting sheet values:", error.message);
    console.error("Full error:", error);
    throw error;
  }
}


export async function createSheetsAuth() {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
  return await auth.getClient();
}


type FetchOverrides = {
  cache?: MemoryCache<any>;
  ttlMs?: number;
  getSheetTitleByGid?: typeof getSheetTitleByGid;
  getValues?: typeof getValues;
  parse?: typeof parseIntegrationConfigsFromRows;
};

export async function fetchIntegrationConfigsViaApi(
  spreadsheetId: string,
  gid: string,
  authClient?: any,
  overrides?: FetchOverrides
) {
  const key = `google:sheet:${spreadsheetId}:${gid}`;
  const cache = overrides?.cache ?? sheetCache;
  const ttl = overrides?.ttlMs ?? FIFTEEN_MIN_MS;
  const getTitle = overrides?.getSheetTitleByGid ?? getSheetTitleByGid;
  const getVals = overrides?.getValues ?? getValues;
  const parse = overrides?.parse ?? parseIntegrationConfigsFromRows;

  return cache.getOrSet(key, ttl, async () => {
    const auth = authClient ?? await createSheetsAuth();
    const title = await getTitle(auth, spreadsheetId, gid);
    const rows = await getVals(auth, spreadsheetId, title);
    return parse(rows);
  });
}