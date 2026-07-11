function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const config = {
  port: Number(process.env.PORT) || 3000,

  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    accessSecret: requireEnv("JWT_ACCESS_SECRET"),

    refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  },
};

export default config;