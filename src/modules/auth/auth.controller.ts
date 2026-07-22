import { Request, Response, NextFunction } from "express";

import { registerUser } from "./auth.services";
import { RegisterInput } from "./auth.validation";

import { LoginInput } from "./auth.validation";
import { loginUser } from "./auth.services";

import { generateAccessToken } from "../../utils/jwt";

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
    const user = await loginUser(req.body);

    const accessToken = generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}