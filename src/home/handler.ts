import { Context } from "hono";
import { Homepage } from "./home.js";
import { getIntegrationConfigs } from "../services/integrations.js";
import { getLogger } from "@logtape/logtape";

const logger = getLogger(["integration-hub"]);

export function handler() {
  return async (c: Context) => {
    const traceId = c.get('traceId');
    try {
      const integrations = await getIntegrationConfigs(traceId);
      logger.debug({ message: "Integrations fetched", traceId, count: integrations.length });
      return c.html(Homepage({ integrations }));
    } catch (error) {
      logger.error({ message: "Failed to fetch integrations", traceId, error: String(error) });
      return c.html(Homepage({ integrations: [] }));
    }
  }
}