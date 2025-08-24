import { Hono } from "hono";
import { serveStatic } from 'hono/bun';
import { traceMiddleware } from './middleware/trace.js';
import { apiRoutes } from './routes/api.js';
import { uiRoutes } from './routes/ui.js';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

export function createApp() {
  const app = new Hono();
  
  // Apply trace middleware to all routes
  app.use('*', traceMiddleware);
  
  // Health check
  app.get("/health", (c) => Promise.resolve(c.json({ status: "ok" }, 200)));
  
  // API routes
  app.route('/api', apiRoutes);
  
  // UI routes
  app.route('/', uiRoutes);
  
  // Static files
  app.use("/:file{.+\.(?!ts|tsx$)[^.]+$}", serveStatic({ root: "./public" }));
  
  return app;
}
