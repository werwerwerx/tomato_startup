import { NextResponse } from "next/server";
import { emailSchema, AuthResponse, REGISTER_EMAIL_ERROR_MSGS, LOGIN_EMAIL_ERROR_MSGS } from "@/features/auth/types";
import { authService } from "@/features/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = emailSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json<AuthResponse>(
        { error: REGISTER_EMAIL_ERROR_MSGS.VALIDATION },
        { status: 400 }
      );
    }

    const { email } = result.data;
    await authService.login(email);

    return NextResponse.json<AuthResponse>(
      { message: "Email sent" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "409") {
        return NextResponse.json<AuthResponse>(
          { error: REGISTER_EMAIL_ERROR_MSGS[409] },
          { status: 409 }
        );
      }
      if (error.message === "404") {
        return NextResponse.json<AuthResponse>(
          { error: LOGIN_EMAIL_ERROR_MSGS[404] },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json<AuthResponse>(
      { error: REGISTER_EMAIL_ERROR_MSGS[500] },
      { status: 500 }
    );
  }
}
