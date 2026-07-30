import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters.")
});

export const loginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1),

  password: z
    .string()
    .min(8)
    .max(100),
});

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;