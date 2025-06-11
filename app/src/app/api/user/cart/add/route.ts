import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import db from "@/shared/db";
import { userCart, userCartDishes } from "@/shared/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dishId, quantity } = await request.json();

    if (!dishId || typeof dishId !== "number") {
      return NextResponse.json(
        { error: "dishId is required and must be a number" },
        { status: 400 },
      );
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json(
        { error: "quantity must be a non-negative number" },
        { status: 400 },
      );
    }

    let cart = await db
      .select()
      .from(userCart)
      .where(eq(userCart.userId, session.user.id))
      .limit(1);

    if (cart.length === 0) {
      const [newCart] = await db
        .insert(userCart)
        .values({
          id: crypto.randomUUID(),
          userId: session.user.id,
        })
        .returning();
      cart = [newCart];
    }

    const cartId = cart[0].id;

    const existingItem = await db
      .select()
      .from(userCartDishes)
      .where(
        and(
          eq(userCartDishes.cartId, cartId),
          eq(userCartDishes.dishId, dishId),
        ),
      )
      .limit(1);

    if (quantity === 0) {
      if (existingItem.length > 0) {
        await db
          .delete(userCartDishes)
          .where(eq(userCartDishes.id, existingItem[0].id));
      }

      return NextResponse.json(
        {
          message: "Item removed from cart",
          dishId,
          quantity: 0,
        },
        { status: 200 },
      );
    } else {
      if (existingItem.length > 0) {
        await db
          .update(userCartDishes)
          .set({ quantity })
          .where(eq(userCartDishes.id, existingItem[0].id));
      } else {
        await db.insert(userCartDishes).values({
          id: crypto.randomUUID(),
          cartId,
          dishId,
          quantity,
        });
      }

      return NextResponse.json(
        {
          message: "Cart updated successfully",
          dishId,
          quantity,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
