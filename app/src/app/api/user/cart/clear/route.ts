import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import db from "@/shared/db";
import { userCart, userCartDishes } from "@/shared/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await db
      .select()
      .from(userCart)
      .where(eq(userCart.userId, session.user.id))
      .limit(1);

    if (cart.length > 0) {
      await db
        .delete(userCartDishes)
        .where(eq(userCartDishes.cartId, cart[0].id));
    }

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
} 