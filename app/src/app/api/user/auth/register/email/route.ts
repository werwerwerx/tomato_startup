import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import db from "@/shared/db";
import {
  account_table,
  verification_login_codes_table,
  verification_registration_codes_table,
} from "@/shared/db/schema";
import {
  sendLoginVerificationMail,
  sendRegisterVerificationCode,
} from "@/shared/lib/resend";
import { eq } from "drizzle-orm";
import { ApiResponse } from "@/shared/types";

type RegisterEmailResponse = ApiResponse<
  "Письмо с кодом аутентификации отправлено вам на почту",
  "Пользователь с таким email уже существует" | "Ошибка при отправке письма" | "Некорректный email" | "Произошла ошибка на стороне сервера"
>;

export type SendRegisterEmailRPC = (
  email: string,
) => Promise<RegisterEmailResponse>;

const sendRegisterEmail = async (
  email: string,
): Promise<NextResponse<RegisterEmailResponse>> => {
  const validateEmail = z.string().email().safeParse(email);
  if (!validateEmail.success) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }

  const [existingUser] = await db
    .select()
    .from(account_table)
    .where(eq(account_table.email, email));

  if (existingUser) {
    return NextResponse.json(
      { error: "Пользователь с таким email уже существует" },
      { status: 409 },
    );
  }

  const code = await processCode(email);
  await sendRegisterVerificationCode(email, code).catch((error) => {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при отправке письма" },
      { status: 500 },
    );
  });

  return NextResponse.json(
    { message: "Письмо с кодом аутентификации отправлено вам на почту" },
    { status: 200 },
  );
};

const processCode = async (email: string): Promise<string> => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

  await db.insert(verification_registration_codes_table).values({
    code,
    email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
  });
  return code;
};


export const POST = async (req: NextRequest): Promise<NextResponse<RegisterEmailResponse>> => {
  const body = await req.json();
  try {
    return await sendRegisterEmail(body.email);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Произошла ошибка на стороне сервера" },
      { status: 500 },
    );
  }
};