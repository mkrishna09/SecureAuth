import { Request, Response, NextFunction } from "express";

import { registerUser } from "./auth.services";
import { RegisterInput } from "./auth.validation";

import { LoginInput } from "./auth.validation";
import { loginUser } from "./auth.services";
import config from "../../config/env";


export async function register(
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    });
   
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result.user,
      accessToken: result.accessToken,
      
    });
  } catch (error) {
    next(error);
  }
}

export function me(
  req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: req.user,
  });
}