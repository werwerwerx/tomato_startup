import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import db from "@/shared/db";
import { userCart, userCartDishes } from "@/shared/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Пользователь не авторизован" },
        { status: 401 },
      );
    }

    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Неверный формат данных. Ожидается массив items" },
        { status: 400 },
      );
    }

    let cart = await db
      .select()
      .from(userCart)
      .where(eq(userCart.userId, session.user.id));

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

    const existingItems = await db
      .select()
      .from(userCartDishes)
      .where(eq(userCartDishes.cartId, cartId));

    for (const item of items) {
      const { dishId, quantity } = item;

      if (typeof dishId !== "number" || typeof quantity !== "number") {
        console.warn(`Пропускаем элемент с неверными типами:`, item);
        continue;
      }

      const existingItem = existingItems.find(
        (existing) => existing.dishId === dishId,
      );

      if (quantity === 0) {
        if (existingItem) {
          await db
            .delete(userCartDishes)
            .where(eq(userCartDishes.id, existingItem.id));
        }
      } else {
        if (existingItem) {
          await db
            .update(userCartDishes)
            .set({ quantity })
            .where(eq(userCartDishes.id, existingItem.id));
        } else {
          await db.insert(userCartDishes).values({
            id: crypto.randomUUID(),
            cartId,
            dishId,
            quantity,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Корзина успешно синхронизирована",
      syncedItems: items.length,
    });
  } catch (error) {
    console.error("Ошибка синхронизации корзины:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
