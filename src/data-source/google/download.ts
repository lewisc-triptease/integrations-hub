import { google } from "googleapis";
import { parseIntegrationConfigsFromRows } from './parse.js';

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


export async function fetchIntegrationConfigsViaApi(
  spreadsheetId: string,
  gid: string,
  authClient?: any
) {
  const auth = authClient ?? await createSheetsAuth();
  const title = await getSheetTitleByGid(auth, spreadsheetId, gid);
  const rows = await getValues(auth, spreadsheetId, title);
  return parseIntegrationConfigsFromRows(rows);
}