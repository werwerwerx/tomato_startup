import { cookies } from "next/headers";
import { envConfig } from "./lib/config";
import jwt from "jsonwebtoken";

export const setTokensToCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(envConfig.ACCESS_TOKEN_KEY, token);
};

export const generateAccessToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, envConfig.JWT_SECRET, { expiresIn: "1h" });
};