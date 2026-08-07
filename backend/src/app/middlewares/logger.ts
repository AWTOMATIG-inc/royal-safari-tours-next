import { Request, Response, NextFunction } from "express";

export const requestResponseLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Intercept json and send methods to capture response payload
  const originalJson = res.json;
  let responseBody: any = null;

  res.json = function (body: any) {
    responseBody = body;
    return originalJson.apply(this, arguments as any);
  };

  const originalSend = res.send;
  res.send = function (body: any) {
    if (!responseBody) {
      try {
        responseBody = JSON.parse(body);
      } catch {
        responseBody = body;
      }
    }
    return originalSend.apply(this, arguments as any);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    console.log(`\x1b[36m[API Req] ${new Date().toISOString()} | ${method} ${originalUrl} | IP: ${ip}\x1b[0m`);
    if (Object.keys(req.query).length > 0) {
      console.log(`  \x1b[90m-> Request Query:\x1b[0m`, req.query);
    }
    if (req.body && Object.keys(req.body).length > 0) {
      // Avoid logging password values directly
      const safeBody = { ...req.body };
      if (safeBody.password) safeBody.password = "********";
      if (safeBody.confirmPassword) safeBody.confirmPassword = "********";
      console.log(`  \x1b[90m-> Request Body:\x1b[0m`, safeBody);
    }
    const color = status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";
    console.log(`  ${color}-> Response Status: ${status} | Duration: ${duration}ms\x1b[0m`);
    if (responseBody) {
      console.log(`  \x1b[90m-> Response Body:\x1b[0m`, responseBody);
    }
    console.log(`\x1b[90m--------------------------------------------------------------------------------\x1b[0m`);
  });

  next();
};
