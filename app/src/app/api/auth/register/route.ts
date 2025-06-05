import { authService } from "@/features/auth/auth.service";
import { loginEmailScmema } from "@/features/auth/shared";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsedBody = loginEmailScmema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email } = parsedBody.data;
  await authService.register(email);
  return NextResponse.json({ message: "code sent" }, { status: 200 });
};