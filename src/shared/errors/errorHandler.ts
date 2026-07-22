// Error Middleware
import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import logger from "../../logger/logger";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
  res.status(400).json({
    success: false,
    message: "Validation failed.",
    errors: err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });

  return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });

    return;
  }

  logger.error(err.stack || err.message || "Unknown error");
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });

}