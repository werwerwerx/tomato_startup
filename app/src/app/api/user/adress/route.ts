import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import db from "@/shared/db";
import { users } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// hold it with consistency
export type AdressResponseDTO = {
  adress?: string | null;
  message?: string;
  shouldRefreshSession: string;
  error?: string;
};

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db
      .select({ adress: users.adress })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    return NextResponse.json(
      {
        adress: user[0]?.adress || null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adress } = await request.json();

    if (!adress || typeof adress !== "string") {
      return NextResponse.json(
        { error: "Address is required and must be a string" },
        { status: 400 },
      );
    }

    await db.update(users).set({ adress }).where(eq(users.id, session.user.id));

    revalidatePath("/profile");
    revalidatePath("/");

    return NextResponse.json(
      {
        message: "Address updated successfully",
        adress,
        shouldRefreshSession: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
