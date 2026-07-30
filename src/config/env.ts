import { z } from "zod";

const envSchema = z.object({
  // Application
  PORT: z.coerce.number().default(3000),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),

  // Database
  DATABASE_URL: z.string().min(1),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(
    32,
    "JWT_ACCESS_SECRET must be at least 32 characters."
  ),

  JWT_REFRESH_SECRET: z.string().min(
    32,
    "JWT_REFRESH_SECRET must be at least 32 characters."
  ),

  // Mailtrap SMTP
  MAIL_HOST: z.string().min(1),

  MAIL_PORT: z.coerce.number(),

  MAIL_USER: z.string().min(1),

  MAIL_PASS: z.string().min(1),

  MAIL_FROM: z.string().email().or(
    z.string().regex(/^.+<.+@.+>$/)
  ),
});

const env = envSchema.parse(process.env);

export default {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,

  database: {
    url: env.DATABASE_URL,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
  },

  mail: {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
    from: env.MAIL_FROM,
  },
};