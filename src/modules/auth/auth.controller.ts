import { Request, Response, NextFunction } from "express";

import { registerUser } from "./auth.services";
import { ForgotPasswordInput, RegisterInput, ResetPasswordInput } from "./auth.validation";

import { LoginInput } from "./auth.validation";
import { loginUser } from "./auth.services";
import config from "../../config/env";

import { refreshAccessToken } from "./auth.services";
import { AppError } from "../../shared/errors/AppError";
import { logout as logoutUser } from "./auth.services";
import { logoutAll as logoutAllUser } from "./auth.services";
import { forgotPassword as forgotPasswordService, } from "./auth.services";
import {
  resetPassword as resetPasswordService,
} from "./auth.services";

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Krishna
 *               email:
 *                 type: string
 *                 example: krishna@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       409:
 *         description: Email already exists.
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates the user and returns an access token. A refresh token is stored as an HttpOnly cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: krishna@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 */
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Uses the refresh token stored in the HttpOnly cookie to issue a new access token.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current session
 *     description: Deletes the current refresh token and clears the refresh token cookie.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out successfully.
 */
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

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     description: Deletes every refresh token belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out from all devices.
 *       401:
 *         description: Unauthorized.
 */
export async function logoutAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await logoutAllUser(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices.",
    });

  } catch (error) {
    next(error);
  }
}

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email if the account exists.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: krishna@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email processed.
 */
export async function forgotPassword(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) {
  try {
    await forgotPasswordService(req.body.email);

    res.status(200).json({
      success: true,
      message:
        "If an account exists, a password reset email has been sent.",
    });

  } catch (error) {
    next(error);
  }
}

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets the user's password using a valid password reset token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: 5dc8b5e0e47f...
 *               password:
 *                 type: string
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token.
 */
export async function resetPassword(
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction
) {
  try {

    await resetPasswordService(
      req.body.token,
      req.body.password
    );

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully.",
    });

  } catch (error) {
    next(error);
  }
}