import { google } from "googleapis";
import { parseIntegrationConfigsFromRows } from './parse.js';
import { MemoryCache } from "@/util/memory-cache.ts";
import { IntegrationConnectionConfiguration } from "@/data-source/google/types.ts";
import { GoogleAuth } from "google-auth-library";
import { logger } from "@/util/logger.ts";

const sheetCache = new MemoryCache<IntegrationConnectionConfiguration[]>();
const FIFTEEN_MIN_MS = 15 * 60 * 1000;

async function getSheetTitleByGid(auth: GoogleAuth, spreadsheetId: string, gid: string): Promise<string> {
  const sheets = google.sheets({ version: "v4", auth });
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });
  const targetId = Number(gid);
  const match = meta.data.sheets?.find(s => s.properties?.sheetId === targetId);
  if (!match?.properties?.title) {
    const error = new Error(`No sheet/tab with gid=${gid} found.`);
    logger.error({ message: 'Failed to get sheet from Google', error });
    throw error;
  }

  return match.properties.title;
}

async function getValues(auth: GoogleAuth, spreadsheetId: string, sheetTitle: string): Promise<string[][]> {
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
  } catch (error: unknown) {

    if (error instanceof Error) {
      logger.error({ message: "Failed to parse values from google sheet", error });
    }

    throw error;
  }
}


export async function createSheetsAuth() {
  return new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
}


export async function fetchIntegrationConfigsViaApi(
  spreadsheetId: string,
  gid: string,
) {
  return sheetCache.getOrSet(`google:sheet:${spreadsheetId}:${gid}`, FIFTEEN_MIN_MS, async () => {
    const auth = await createSheetsAuth();
    const title = await getSheetTitleByGid(auth, spreadsheetId, gid);
    const rows = await getValues(auth, spreadsheetId, title);
    return parseIntegrationConfigsFromRows(rows);
  });
}