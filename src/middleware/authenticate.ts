import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import config from "../config/env";
import { AppError } from "../shared/errors/AppError";

interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
}

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

    if (!token || scheme !== "Bearer") {
      throw new AppError("Invalid authorization header.", 401);
    }

    const decoded = jwt.verify(
      token,
      config.jwt.accessSecret
    );

    next();

  } catch (error) {
    next(
      new AppError(
        "Invalid or expired token.",
        401
      )
    );
  }
}