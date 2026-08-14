import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

const store = new Map<string, RateLimitEntry>();

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

setInterval(cleanupExpiredEntries, 60_000);

export const rateLimiter = (options: RateLimiterOptions) => {
  const { windowMs, maxRequests, message } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    let entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime: now + windowMs };
      store.set(key, entry);
      next();
      return;
    }

    entry.count++;

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.status(429).json({
        success: false,
        error: message || `Too many requests. Try again in ${retryAfter} seconds.`,
      });
      return;
    }

    next();
  };
};

export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});

export const strictRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many attempts. Account may be temporarily locked. Try again in 15 minutes.",
});
