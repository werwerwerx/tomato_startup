import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import db from "@/shared/db";
import { userCart, userCartDishes, dishes_table, img_table } from "@/shared/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartWithDishes = await db
      .select({
        dishId: userCartDishes.dishId,
        quantity: userCartDishes.quantity,
        dish: {
          id: dishes_table.id,
          name: dishes_table.name,
          description: dishes_table.description,
          price: dishes_table.price,
          image: img_table.url,
        },
      })
      .from(userCart)
      .innerJoin(userCartDishes, eq(userCartDishes.cartId, userCart.id))
      .innerJoin(dishes_table, eq(userCartDishes.dishId, dishes_table.id))
      .leftJoin(img_table, eq(dishes_table.imgId, img_table.id))
      .where(eq(userCart.userId, session.user.id));

    const formattedCart = cartWithDishes.map((item) => ({
      dishId: item.dishId,
      quantity: item.quantity,
      dish: {
        id: item.dish.id,
        name: item.dish.name,
        description: item.dish.description,
        price: item.dish.price,
        image: item.dish.image || "",
      },
    }));

    return NextResponse.json({
      success: true,
      cartItems: formattedCart,
      count: formattedCart.length,
    });
  } catch (error) {
    console.error("Error fetching cart dishes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
} 