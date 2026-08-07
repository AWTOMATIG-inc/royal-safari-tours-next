import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`\x1b[31m[API Error] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}\x1b[0m`);
  console.error(`  \x1b[90m-> Headers:\x1b[0m`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "********";
    console.error(`  \x1b[90m-> Request Body:\x1b[0m`, safeBody);
  }
  console.error(`  \x1b[31m-> Error: ${message}\x1b[0m`);
  console.error(`  \x1b[90m-> Stack Trace:\x1b[0m\n`, err.stack || err);
  console.error(`\x1b[90m--------------------------------------------------------------------------------\x1b[0m`);

  res.status(status).json({
    success: false,
    status,
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
