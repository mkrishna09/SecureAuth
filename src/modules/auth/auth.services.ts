import bcrypt from "bcrypt";

import prisma from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import { RegisterInput } from "./auth.validation";
import { LoginInput } from "./auth.validation";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
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

export async function refreshAccessToken(
  refreshToken: string
) {
  // Verify JWT
  const payload = verifyRefreshToken(refreshToken);

  // Hash the token
  const tokenHash = hashToken(refreshToken);

  // Find refresh token in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!storedToken) {
    throw new AppError(
      "Invalid refresh token.",
      401
    );
  }

  // Check expiry
  if (storedToken.expiresAt < new Date()) {
    throw new AppError(
      "Refresh token expired.",
      401
    );
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: {
      id: storedToken.userId,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    sub: user.id,
  });

  // Hash new refresh token
  const newTokenHash = hashToken(newRefreshToken);

  // Rotate refresh token
  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    }),

    prisma.refreshToken.create({
      data: {
        tokenHash: newTokenHash,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
      },
    }),
  ]);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(
  refreshToken?: string
) {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);

  await prisma.refreshToken.deleteMany({
    where: {
      tokenHash,
    },
  });
}