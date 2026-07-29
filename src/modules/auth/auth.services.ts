import bcrypt from "bcrypt";

import prisma from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import { RegisterInput } from "./auth.validation";
import { LoginInput } from "./auth.validation";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt";

import { hashToken } from "../../utils/hash";
import { ref } from "node:process";

export async function registerUser(input: RegisterInput) {
  // Normalize email
  const email = input.email.toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists.", 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name: input.name ?? null,
      passwordHash,
    },
  });


  // Return safe user object (DTO)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
  where: {
    email,
    },
  });

  if (!user) {
  throw new AppError(
    "Invalid email or password.",
    401
    );
  }
  const passwordMatches = await bcrypt.compare(
  input.password,
  user.passwordHash
  );
  if (!passwordMatches) {
  throw new AppError(
    "Invalid email or password.",
    401
    );
  }

  const accessToken = generateAccessToken({
  sub: user.id,
  email: user.email,
  role: user.role,
});

const refreshToken = generateRefreshToken({
  sub: user.id,
});

const tokenHash = hashToken(refreshToken);
await prisma.refreshToken.create({
  data: {
    tokenHash,
    userId: user.id,
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
  },
});

return {
  user,
  accessToken,
  refreshToken,
};
}