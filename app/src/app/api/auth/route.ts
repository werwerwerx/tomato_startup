import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const AuthReqSchema = z.object({
  email: z.string().email().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = AuthReqSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email } = parsedBody.data;

  const userCandidate = await   

}