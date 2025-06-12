import { auth } from "@/app/auth";
import db from "@/shared/db";
import { favorite } from "@/shared/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { dishId } = await req.json();
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!dishId || typeof dishId !== "number") {
    return NextResponse.json(
      { error: "dishId is required and must be a number" },
      { status: 400 }
    );
  }

  await db
    .delete(favorite)
    .where(
      and(
        eq(favorite.userId, session.user.id),
        eq(favorite.dishId, dishId)
      )
    );

  return NextResponse.json({ message: "Favorite removed", dishId });
} 