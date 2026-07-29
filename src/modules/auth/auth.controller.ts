import { Request, Response, NextFunction } from "express";

import { registerUser } from "./auth.services";
import { RegisterInput } from "./auth.validation";

import { LoginInput } from "./auth.validation";
import { loginUser } from "./auth.services";
import config from "../../config/env";

import { refreshAccessToken } from "./auth.services";
import { AppError } from "../../shared/errors/AppError";
import { logout as logoutUser } from "./auth.services";



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

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token missing.",
        401
      );
    }

    const result = await refreshAccessToken(
      refreshToken
    );

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    });

  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await logoutUser(
      req.cookies?.refreshToken
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });

  } catch (error) {
    next(error);
  }
}