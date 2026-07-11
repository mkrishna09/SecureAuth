// Error Middleware
import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import logger from "../../logger/logger";


export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });

    return;
  }

  logger.error(err);

  res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
    },
  });
}