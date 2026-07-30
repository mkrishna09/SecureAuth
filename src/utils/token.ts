import crypto from "crypto";

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}