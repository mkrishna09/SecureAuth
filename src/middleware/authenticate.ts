import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

import config from "../config/env";
import { AppError } from "../shared/errors/AppError";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authentication required.", 401);
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header.", 401);
    }

    const decoded = verifyAccessToken(token);

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw new AppError("Invalid token.", 401);
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(
        "Invalid or expired token.",
        401
      )
    );
  }
}