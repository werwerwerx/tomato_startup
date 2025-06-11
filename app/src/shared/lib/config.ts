import { z } from "zod";
import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config();

const serverConfigSchema = z.object({
  DATABASE_PORT: z.string().min(1, "DB PORT is required"),
  DATABASE_PASSWORD: z.string().min(1, "DB PASSWORD is required"),
  DATABASE_HOST: z.string().min(1, "DB HOST is required"),
  DATABASE_USER: z.string().min(1, "DB USER is required"),
  DATABASE_DB: z.string().min(1, "DB DB is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND API KEY is required"),
  APP_URL:
    process.env.NODE_ENV === "production"
      ? z.string().min(1, "APP URL is required")
      : z.string().min(1).default("http://localhost:3000"),
  IS_HTTPS:
    process.env.NODE_ENV === "production"
      ? z.boolean().default(true)
      : z.boolean().default(false),
  NODE_ENV: z.enum(["production", "development"], {
    errorMap: () => ({ message: "NODE_ENV is required" }),
  }),
  YANDEX_CLIENT_ID: z.string().min(1, "YANDEX CLIENT ID is required"),
  YANDEX_CLIENT_SECRET: z.string().min(1, "YANDEX CLIENT SECRET is required"),
  AUTH_SECRET: z.string().min(1, "AUTH SECRET is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB CLIENT ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB CLIENT SECRET is required"),
  DISCORD_CLIENT_ID: z.string().min(1, "DISCORD CLIENT ID is required"),
  DISCORD_CLIENT_SECRET: z.string().min(1, "DISCORD CLIENT SECRET is required"),
  GEOSUGGEST_API_KEY: z.string().optional(), 
});

const clientConfigSchema = z.object({
  GEOSUGGEST_API_KEY: z.string().optional(), 
});

const getServerConfig = () => {
  if (typeof window !== "undefined") {
    throw new Error("Server config cannot be used on the client side");
  }

  return serverConfigSchema.parse({
    DATABASE_PORT: process.env.POSTGRES_PORT,
    DATABASE_PASSWORD: process.env.POSTGRES_PASSWORD,
    DATABASE_HOST: process.env.POSTGRES_HOST,
    DATABASE_USER: process.env.POSTGRES_USER,
    DATABASE_DB: process.env.POSTGRES_DB,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    APP_URL: process.env.APP_URL,
    IS_HTTPS: process.env.NODE_ENV === "production",
    NODE_ENV: process.env.NODE_ENV as "production" | "development",
    YANDEX_CLIENT_ID: process.env.YANDEX_CLIENT_ID,
    YANDEX_CLIENT_SECRET: process.env.YANDEX_CLIENT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    GEOSUGGEST_API_KEY: process.env.GEOSUGGEST_API_KEY,
  });
};

// Серверный конфиг (только для сервера)
export const envConfig = typeof window === "undefined" ? (() => {
  const serverConfig = getServerConfig();
  return {
    ...serverConfig,
    DATABASE_URL: `postgresql://${serverConfig.DATABASE_USER}:${serverConfig.DATABASE_PASSWORD}@${serverConfig.DATABASE_HOST}:${serverConfig.DATABASE_PORT}/${serverConfig.DATABASE_DB}`,
    ACCESS_TOKEN_KEY: "access-token",
  };
})() : {} as any;

// Клиентский конфиг (безопасный для клиента)
export const envClientConfig = clientConfigSchema.parse({
  GEOSUGGEST_API_KEY: process.env.NEXT_PUBLIC_GEOSUGGEST_API_KEY,
});

