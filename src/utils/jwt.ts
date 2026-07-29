import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { SignOptions } from "jsonwebtoken";

import config from "../config/env";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string;
}

function signToken(
  payload: object,
  secret: jwt.Secret,
  expiresIn: "15m" | "30d"
): string {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
}

export function generateAccessToken(
  payload: AccessTokenPayload
): string {
  return signToken(
    payload,
    config.jwt.accessSecret,
    "15m"
  );
}

export function generateRefreshToken(
  payload: RefreshTokenPayload
): string {
  return signToken(
    payload,
    config.jwt.refreshSecret,
    "30d"
  );
}

export function verifyAccessToken(
  token: string
): AccessTokenPayload {
  return jwt.verify(
    token,
    config.jwt.accessSecret
  ) as AccessTokenPayload;
}

export function verifyRefreshToken(
  token: string
): RefreshTokenPayload {
  return jwt.verify(
    token,
    config.jwt.refreshSecret
  ) as RefreshTokenPayload;
}