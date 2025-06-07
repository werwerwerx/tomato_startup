import db from "@/shared/db";
import { account_table } from "@/shared/db/schema";
import { sendLoginVerificationMail } from "@/shared/lib/resend";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  return sendLoginEmail(body.email);
};

export type LoginResponse = {
  message?: "Письмо с кодом аутентификации отправлено вам на почту";
  error?:
    | "Пользователь с таким email не найден"
    | "Ошибка при отправке письма"
    | "Некорректный email";
};

const sendLoginEmail = async (
  email: string,
): Promise<NextResponse<LoginResponse>> => {
  const validateEmail = z.string().email().safeParse(email);
  if (!validateEmail.success) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }

  const [user] = await db
    .select()
    .from(account_table)
    .where(eq(account_table.email, email));
  if (!user || user.provider !== "email" || !user.email) {
    return NextResponse.json(
      { error: "Пользователь с таким email не найден" },
      { status: 404 },
    );
  }

  const code = generateCode();
  await sendLoginVerificationMail(user.email, code).catch((error) => {
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

export type SendLoginEmailRPC = (email: string) => Promise<LoginResponse>;

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};
