import { auth } from "@/app/auth";
import db from "@/shared/db";
import { favorite } from "@/shared/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected array of items" },
        { status: 400 },
      );
    }

    const validItems = items
      .filter((item) => typeof item.dishId === "number")
      .map((item) => ({
        id: crypto.randomUUID(),
        dishId: item.dishId,
        userId: session.user.id,
      }));

    if (validItems.length > 0) {
      await db.insert(favorite).values(validItems).onConflictDoNothing();
    }

    return NextResponse.json({
      success: true,
      message: "Favorites synced successfully",
      syncedItems: validItems.length,
    });
  } catch (error) {
    console.error("Error syncing favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
