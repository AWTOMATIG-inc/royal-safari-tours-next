import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.errors ? error.errors[0]?.message : "Validation failed",
        details: error.errors || error.message,
      });
    }
  };
};

export const validateQuery = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.errors ? error.errors[0]?.message : "Query validation failed",
        details: error.errors || error.message,
      });
    }
  };
};
