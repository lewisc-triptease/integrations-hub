import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { createApp } from "./app.js";

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [
    { category: "integration-hub", lowestLevel: "debug", sinks: ["console"] }
  ]
});

const logger = getLogger(["integration-hub"]);

const app = createApp();

const port = Number(process.env.PORT) || 9898;

Bun.serve({
  port,
  fetch: app.fetch,
});

logger.info({ message: 'Server started', port });
