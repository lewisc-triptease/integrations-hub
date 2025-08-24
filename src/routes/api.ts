import { Hono } from "hono";
import { getLogger } from "@logtape/logtape";
import { getIntegrationConfigs } from '../services/integrations.js';
import { createResponseWithTrace } from '../middleware/response.js';

const logger = getLogger(["integration-hub"]);

export const apiRoutes = new Hono();

apiRoutes.get("/integrations", async (c) => {
  const traceId = c.get('traceId');

  try {
    const data = await getIntegrationConfigs(traceId);
    return createResponseWithTrace(
      traceId, 
      JSON.stringify(data), 
      200, 
      { "Content-Type": "application/json" }
    );
  } catch (error) {
    logger.error({ message: "Failed to fetch integration configs", traceId, error: String(error) });
    return createResponseWithTrace(traceId, "Internal Server Error", 500);
  }
});
