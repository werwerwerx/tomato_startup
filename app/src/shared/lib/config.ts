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
  JWT_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1, "JWT SECRET is required") : z.string().min(1).default("secret"),
  RESEND_API_KEY: z.string().min(1, "RESEND API KEY is required"),
});

const parsedCnf = configSchema.parse({
  DATABASE_PORT: process.env.POSTGRES_PORT,
  DATABASE_PASSWORD: process.env.POSTGRES_PASSWORD,
  DATABASE_HOST: process.env.POSTGRES_HOST,
  DATABASE_USER: process.env.POSTGRES_USER,
  DATABASE_DB: process.env.POSTGRES_DB,
  JWT_SECRET: process.env.JWT_SECRET,
});

export const envConfig = {
  ...parsedCnf,
  DATABASE_URL: `postgresql://${parsedCnf.DATABASE_USER}:${parsedCnf.DATABASE_PASSWORD}@${parsedCnf.DATABASE_HOST}:${parsedCnf.DATABASE_PORT}/${parsedCnf.DATABASE_DB}`,
  AUTH_TOKEN_NAME: "auth-token",
};
