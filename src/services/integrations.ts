import { getLogger } from "@logtape/logtape";
import { fetchIntegrationConfigsViaApi } from '../data-source/google/download.js';

const logger = getLogger(["integration-hub-service"]);

export async function getIntegrationConfigs(traceId?: string) {
  if (!process.env.SHEET_NAME || !process.env.SHEET_GID) {
    logger.error({ message: "SHEET_NAME or SHEET_GID is not set in environment variables", traceId });
    throw new Error("Configuration missing: SHEET_NAME or SHEET_GID");
  }

  try {
    const data = await fetchIntegrationConfigsViaApi(process.env.SHEET_NAME, process.env.SHEET_GID);
    logger.info({ message: "Integration configs fetched", traceId, data });
    return data;
  } catch (error) {
    logger.error({ message: "Failed to fetch integration configs", traceId, error: String(error) });
    throw error;
  }
}
