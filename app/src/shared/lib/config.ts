import { z } from "zod";
import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config();

const configSchema = z.object({
  DATABASE_PORT: z.string().min(1, "DB PORT is required"),
  DATABASE_PASSWORD: z.string().min(1, "DB PASSWORD is required"),
  DATABASE_HOST: z.string().min(1, "DB HOST is required"),
  DATABASE_USER: z.string().min(1, "DB USER is required"),
  DATABASE_DB: z.string().min(1, "DB DB is required"),
  JWT_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1, "JWT SECRET is required")
      : z.string().min(1).default("secret"),
  RESEND_API_KEY: z.string().min(1, "RESEND API KEY is required"),
  APP_URL:
    process.env.NODE_ENV === "production"
      ? z.string().min(1, "APP URL is required")
      : z.string().min(1).default("http://localhost:3000"),
  IS_HTTPS: process.env.NODE_ENV === "production" ? z.boolean().default(true) : z.boolean().default(false),
  NODE_ENV: z.enum(["production", "development"], {
    errorMap: () => ({ message: "NODE_ENV is required" }),
  }),
  YANDEX_CLIENT_ID: z.string().min(1, "YANDEX CLIENT ID is required"),
  YANDEX_CLIENT_SECRET: z.string().min(1, "YANDEX CLIENT SECRET is required"),
  NEXTAUTH_URL: process.env.NODE_ENV === "production" ? z.string().min(1, "NEXTAUTH URL is required") : z.string().min(1).default("http://localhost:3000"),
})
let parsedCnf: z.infer<typeof configSchema>;
try {
  parsedCnf = configSchema.parse({
    DATABASE_PORT: process.env.POSTGRES_PORT,
    DATABASE_PASSWORD: process.env.POSTGRES_PASSWORD,
    DATABASE_HOST: process.env.POSTGRES_HOST,
    DATABASE_USER: process.env.POSTGRES_USER,
    DATABASE_DB: process.env.POSTGRES_DB,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    APP_URL: process.env.APP_URL,
    IS_HTTPS: process.env.NODE_ENV === "production",
    NODE_ENV: process.env.NODE_ENV as "production" | "development",
    YANDEX_CLIENT_ID: process.env.YANDEX_CLIENT_ID,
    YANDEX_CLIENT_SECRET: process.env.YANDEX_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  });
} catch (error) {
  console.error("Error parsing config:", error);
  throw error;
}

export const envConfig = {
  ...parsedCnf,
  DATABASE_URL: `postgresql://${parsedCnf.DATABASE_USER}:${parsedCnf.DATABASE_PASSWORD}@${parsedCnf.DATABASE_HOST}:${parsedCnf.DATABASE_PORT}/${parsedCnf.DATABASE_DB}`,
  ACCESS_TOKEN_KEY: "access-token",
};
