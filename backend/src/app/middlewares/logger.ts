import { Request, Response, NextFunction } from "express";

/**
 * Industry-Standard Production HTTP Access & Diagnostic Logger
 *
 * Design Principles:
 * 1. Single concise, structured line per request (Timestamp, Method, URL, Status, Duration, Size, IP).
 * 2. Visual color-coding (Green 2xx, Cyan 3xx, Yellow 4xx, Red 5xx).
 * 3. Does not dump large request/response payloads to avoid terminal clutter and data leaks.
 * 4. Concise contextual diagnostic line strictly when client (4xx) or server (5xx) errors occur.
 * 5. Skips noisy internal health checks and static icon requests.
 */
export const requestResponseLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  const { method, originalUrl } = req;

  // Filter out internal health checks and static favicon requests
  if (originalUrl === "/api/v1/health" || originalUrl.endsWith(".ico")) {
    return next();
  }

  // Intercept error messages for 4xx/5xx responses to show diagnostic hint
  let errorReason: string | null = null;
  const originalJson = res.json;

  res.json = function (body: any) {
    if (res.statusCode >= 400 && body) {
      errorReason = body.error || body.message || (typeof body === "string" ? body : null);
    }
    return originalJson.apply(this, arguments as any);
  };

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationMs = ((diff[0] * 1e3) + (diff[1] * 1e-6)).toFixed(2);
    const status = res.statusCode;
    const contentLength = res.getHeader("content-length") || "0";
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "::1";
    const timestamp = new Date().toISOString();

    // High-visibility ANSI Colors
    const green = "\x1b[32m";
    const cyan = "\x1b[36m";
    const yellow = "\x1b[33m";
    const red = "\x1b[31m";
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const dim = "\x1b[90m";

    let statusColor = green;
    if (status >= 500) statusColor = red;
    else if (status >= 400) statusColor = yellow;
    else if (status >= 300) statusColor = cyan;

    // Standard 1-line production access log
    console.log(
      `${dim}[${timestamp}]${reset} ${bold}${method.padEnd(6)}${reset} ${originalUrl} ${statusColor}${bold}${status}${reset} ${dim}${durationMs}ms - ${contentLength}b (${ip})${reset}`
    );

    // Single concise diagnostic line if an error occurred
    if (status >= 400 && errorReason) {
      console.log(`  ${statusColor}└── Reason: ${errorReason}${reset}`);
    }
  });

  next();
};
