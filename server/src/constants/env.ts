import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing Environment Variable for ${key}`);
  }

  return value;
};

export const PORT = getEnv("PORT", "5000");
export const DATABASE_URL = getEnv("DATABASE_URL");
export const JWT_SECRET = getEnv("JWT_SECRET", "supersecret");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const ADMIN_EMAIL = getEnv("ADMIN_EMAIL");
export const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD");
export const FRONTEND_URL = getEnv("FRONTEND_URL", "http://localhost:3000");
