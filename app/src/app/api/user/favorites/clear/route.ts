import { auth } from "@/app/auth";
import db from "@/shared/db";
import { favorite } from "@/shared/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(favorite).where(eq(favorite.userId, session.user.id));

    return NextResponse.json({
      success: true,
      message: "All favorites cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
} 