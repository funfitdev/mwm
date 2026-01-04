import { Logger } from "seq-logging";

export type Middleware = (
  req: Request,
  next: () => Promise<Response>
) => Promise<Response>;

// Seq logger instance
const seqServerUrl = process.env.SEQ_SERVER_URL;
const seqApiKey = process.env.SEQ_API_KEY;

const seqLogger = seqServerUrl
  ? new Logger({
      serverUrl: seqServerUrl,
      apiKey: seqApiKey,
      onError: (e) => console.error("Seq logging error:", e),
    })
  : null;

// Log levels for Seq
type LogLevel = "Verbose" | "Debug" | "Information" | "Warning" | "Error" | "Fatal";

// Structured logging helper
export function log(
  level: LogLevel,
  messageTemplate: string,
  properties?: Record<string, unknown>
) {
  const timestamp = new Date();

  // Always log to console
  const consoleMsg = messageTemplate.replace(
    /\{(\w+)\}/g,
    (_, key) => String(properties?.[key] ?? `{${key}}`)
  );
  const prefix = level === "Error" || level === "Fatal" ? "✗" : level === "Warning" ? "⚠" : "→";
  console.log(`${prefix} [${level}] ${consoleMsg}`);

  // Send to Seq if configured
  if (seqLogger) {
    seqLogger.emit({
      timestamp,
      level,
      messageTemplate,
      properties,
    });
  }
}

// Flush logs (call before shutdown)
export async function flushLogs() {
  if (seqLogger) {
    await seqLogger.close();
  }
}

export function applyMiddleware(
  middlewares: Middleware[],
  handler: (req: Request) => Response | Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    let index = 0;

    const next = async (): Promise<Response> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++]!;
        return middleware(req, next);
      }
      const result = handler(req);
      return result instanceof Promise ? result : result;
    };

    return next();
  };
}

// Logger middleware with Seq integration
export const logger: Middleware = async (req, next) => {
  const url = new URL(req.url);
  const start = performance.now();

  let res: Response | undefined;
  let error: Error | undefined;

  try {
    res = await next();
    return res;
  } catch (e) {
    error = e instanceof Error ? e : new Error(String(e));
    throw e;
  } finally {
    const duration = performance.now() - start;
    const statusCode = error ? 500 : res?.status ?? 0;
    const level: LogLevel = error ? "Error" : statusCode >= 400 ? "Warning" : "Information";

    log(level, "HTTP {Method} {Path} responded {StatusCode} in {Duration}ms", {
      Method: req.method,
      Path: url.pathname,
      StatusCode: statusCode,
      Duration: Math.round(duration * 100) / 100,
      Query: url.search || undefined,
      UserAgent: req.headers.get("User-Agent") || undefined,
      ContentType: res?.headers.get("Content-Type") || undefined,
      Error: error?.message,
    });
  }
};

// MIME types that should be compressed
const compressibleTypes = new Set([
  "text/html",
  "text/css",
  "text/plain",
  "text/xml",
  "text/javascript",
  "application/json",
  "application/javascript",
  "application/xml",
  "application/xhtml+xml",
  "image/svg+xml",
]);

// Check if content type is compressible
function isCompressible(contentType: string | null): boolean {
  if (!contentType) return false;
  const mimeType = contentType.split(";")[0]?.trim() ?? "";
  return compressibleTypes.has(mimeType);
}

// Minimum size to compress (1KB)
const MIN_COMPRESS_SIZE = 1024;

// Gzip compression middleware
export const gzip: Middleware = async (req, next) => {
  const res = await next();
  const acceptEncoding = req.headers.get("Accept-Encoding") || "";

  // Skip if client doesn't accept gzip
  if (!acceptEncoding.includes("gzip")) {
    return res;
  }

  // Skip if no body or already encoded
  if (!res.body || res.headers.get("Content-Encoding")) {
    return res;
  }

  // Skip if content type is not compressible
  const contentType = res.headers.get("Content-Type");
  if (!isCompressible(contentType)) {
    return res;
  }

  const body = await res.arrayBuffer();

  // Skip small responses
  if (body.byteLength < MIN_COMPRESS_SIZE) {
    return new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  }

  const compressed = Bun.gzipSync(new Uint8Array(body));

  // Only use compressed version if it's actually smaller
  if (compressed.byteLength >= body.byteLength) {
    return new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  }

  const headers = new Headers(res.headers);
  headers.set("Content-Encoding", "gzip");
  headers.set("Content-Length", compressed.byteLength.toString());
  headers.delete("Content-Length"); // Let it be calculated
  headers.set("Vary", "Accept-Encoding");

  return new Response(compressed, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
};

// Default middleware stack
export const defaultMiddlewares: Middleware[] = [logger, gzip];

// Wrap a route handler with middleware
export function withMiddleware(
  handler: (req: Request) => Response | Promise<Response>,
  middlewares: Middleware[] = defaultMiddlewares
) {
  return applyMiddleware(middlewares, handler);
}
