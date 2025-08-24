import { Hono } from "hono";
import { serveStatic } from 'hono/bun';
import { traceMiddleware } from './middleware/trace.js';
import { apiRoutes } from './routes/api.js';
import { uiRoutes } from './routes/ui.js';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

export function createApp() {
  const app = new Hono();
  
  app.use('*', traceMiddleware);
  
  app.get("/health", (c) => Promise.resolve(c.json({ status: "ok" }, 200)));
  
  app.route('/api', apiRoutes);
  
  app.route('/', uiRoutes);
  
  app.use("/:file{.+\.(?!ts|tsx$)[^.]+$}", serveStatic({ root: "./public" }));
  
  return app;
}
