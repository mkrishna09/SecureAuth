import jwt from "jsonwebtoken";

import config from "../config/env";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export function generateAccessToken(
  payload: AccessTokenPayload
) {
  return jwt.sign(
    payload,
    config.jwt.accessSecret,
    {
      expiresIn: "15m",
    }
  );
}