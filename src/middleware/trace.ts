import { Context, Next } from "hono";

export function getTraceId(req: Request) {
  const providedTraceId = req.headers.get("x-trace-id") || req.headers.get("x-request-id");
  return (providedTraceId && providedTraceId.trim()) ? providedTraceId : crypto.randomUUID();
}

export async function traceMiddleware(c: Context, next: Next) {
  const traceId = getTraceId(c.req.raw);
  c.set('traceId', traceId);
  await next();
}

declare module 'hono' {
  interface ContextVariableMap {
    traceId: string;
  }
}