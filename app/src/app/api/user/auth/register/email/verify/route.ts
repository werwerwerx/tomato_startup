import { NextRequest, NextResponse } from "next/server";
import db from "@/shared/db";
import {
  account_table,
  users_table,
  verification_registration_codes_table,
} from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";
import { envConfig } from "@/shared/lib/config";
import jwt from "jsonwebtoken";

import { ApiResponse } from "@/shared/types";
import { generateAccessToken, setTokensToCookie } from "@/shared/tokens";

type VerifyCodeResponse = ApiResponse<
  "Успешно зарегистрирован",
  "Некорректный код" | "Срок действия кода истек" | "Произошла ошибка на стороне сервера"
>;

export type VerifyCodeRPC = (code: string) => Promise<VerifyCodeResponse>;


const verifyCode = async (
  code: string,
): Promise<NextResponse<VerifyCodeResponse>> => {
  const codeValidationResult = await validateCode(code);
  if (codeValidationResult instanceof NextResponse) {
    return codeValidationResult;
  }
  const [user] = await db.insert(users_table).values({}).returning();

  await db.insert(account_table).values({
    email: codeValidationResult,
    name: "user",
    provider: "email",
    avatar_url:
      "https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg",
    userId: user.id,
  });

  const jwtAccessToken = generateAccessToken(user.id, codeValidationResult);
  const response: NextResponse<VerifyCodeResponse> = NextResponse.json(
    { message: "Успешно зарегистрирован" },
    { status: 200 },
  );
  await setTokensToCookie(jwtAccessToken);
  return response;
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const code = body.code;
  try {
    const email = await validateCode(code);
    if (typeof email === "string") {
      return verifyCode(email);
    }
    return email;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Произошла ошибка на стороне сервера" },
      { status: 500 },
    );
  }
};

export const validateCode = async (
  code: string,
): Promise<string | NextResponse<VerifyCodeResponse>> => {
  const codeSchema = z.string().length(6);
  if (!codeSchema.safeParse(code).success) {
    return NextResponse.json({ error: "Некорректный код" }, { status: 400 });
  }
  const [existingCode] = await db
    .select()
    .from(verification_registration_codes_table)
    .where(eq(verification_registration_codes_table.code, code));

  if (!existingCode) {
    return NextResponse.json({ error: "Некорректный код" }, { status: 400 });
  }

  if (existingCode.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Срок действия кода истек" },
      { status: 400 },
    );
  }

  return existingCode.email;
};
