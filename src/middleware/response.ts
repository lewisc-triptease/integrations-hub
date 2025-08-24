
export const addTraceHeader = (traceId: string, headers?: HeadersInit) => {
  const h = new Headers(headers);
  h.set("X-Trace-Id", traceId);
  return h;
};

export const createResponseWithTrace = (traceId: string, body: any, status = 200, headers?: HeadersInit) => {
  const responseHeaders = addTraceHeader(traceId, headers);
  return new Response(body, { status, headers: responseHeaders });
};