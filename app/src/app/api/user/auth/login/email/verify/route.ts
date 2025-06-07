import db from "@/shared/db";
import { account_table, verification_login_codes_table } from "@/shared/db/schema";
import { envConfig } from "@/shared/lib/config";
import { generateAccessToken, setTokensToCookie } from "@/shared/tokens";
import { ApiResponse } from "@/shared/types";
import { eq, and, gte } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type VerifyLoginResponse = ApiResponse<
  "Успешно авторизован",
  "Неверный код" | "Код подтверждения истек" | "Ошибка на стороне сервера"
>;

export const GET = async (request: NextRequest): Promise<NextResponse<VerifyLoginResponse>> => {
  const body = await request.json();
  const { code, email } = body;
  const response = await verifyLogin(code, email);
  if(response.error) {
    return NextResponse.json(response, { status: 400 });
  }
  const cookieStore = await cookies();
  const [account] = await db.select().from(account_table).where(eq(account_table.email, email));
  if(!account) {
    return NextResponse.json({
      error: "Ошибка на стороне сервера" //bc wtf
    }, { status: 400 });
  }
  const token = generateAccessToken(account.id, email);
  setTokensToCookie(token);
  return NextResponse.json(response);
};

export type VerifyLoginRPC = (
  code: string,
  email: string,
) => Promise<VerifyLoginResponse>;

const verifyLogin = async (code: string, email: string): Promise<VerifyLoginResponse> => {
  const [codeMatch] = await db
    .select()
    .from(verification_login_codes_table)
    .where(
      and(
        eq(verification_login_codes_table.code, code),
        eq(verification_login_codes_table.email, email),
      ),
    );

  if (!codeMatch) {
    return {
      error: "Неверный код"
    }
  }
  if(codeMatch.expiresAt < new Date()) {
    return {
      error: "Код подтверждения истек",
    };
  }

  return {
    message: "Успешно авторизован",
  };
};
