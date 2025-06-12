import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import db from "@/shared/db";
import { orders, orderItems, userCart, userCartDishes } from "@/shared/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deliveryAddress } = await req.json();

    if (!deliveryAddress || typeof deliveryAddress !== "string") {
      return NextResponse.json(
        { error: "deliveryAddress is required" },
        { status: 400 },
      );
    }

    const cart = await db
      .select()
      .from(userCart)
      .where(eq(userCart.userId, session.user.id))
      .limit(1);

    if (cart.length === 0) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartItems = await db
      .select()
      .from(userCartDishes)
      .where(eq(userCartDishes.cartId, cart[0].id));

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    let totalAmount = 0;

    const orderItemsToInsert = cartItems.map((item) => {
      const itemTotal = item.quantity * 100; // placeholder price
      totalAmount += itemTotal;
      return {
        id: crypto.randomUUID(),
        orderId,
        dishId: item.dishId,
        quantity: item.quantity,
        price: 100, // placeholder, should get from dishes table
      };
    });

    await db.insert(orders).values({
      id: orderId,
      userId: session.user.id,
      status: "pending",
      totalAmount,
      deliveryAddress,
    });

    await db.insert(orderItems).values(orderItemsToInsert);

    await db.delete(userCartDishes).where(eq(userCartDishes.cartId, cart[0].id));

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId,
      totalAmount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
} 