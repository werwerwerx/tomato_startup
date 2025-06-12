import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import db from "@/shared/db";
import { orders, orderItems, dishes_table, img_table } from "@/shared/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrders = await db
      .select({
        orderId: orders.id,
        status: orders.status,
        totalAmount: orders.totalAmount,
        deliveryAddress: orders.deliveryAddress,
        createdAt: orders.createdAt,
        itemId: orderItems.id,
        dishId: orderItems.dishId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        dish: {
          id: dishes_table.id,
          name: dishes_table.name,
          description: dishes_table.description,
          image: img_table.url,
        },
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(dishes_table, eq(orderItems.dishId, dishes_table.id))
      .leftJoin(img_table, eq(dishes_table.imgId, img_table.id))
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt));

    const ordersMap = new Map();

    userOrders.forEach((row) => {
      if (!ordersMap.has(row.orderId)) {
        ordersMap.set(row.orderId, {
          id: row.orderId,
          status: row.status,
          totalAmount: row.totalAmount,
          deliveryAddress: row.deliveryAddress,
          createdAt: row.createdAt,
          items: [],
        });
      }

      if (row.itemId && row.dish) {
        ordersMap.get(row.orderId).items.push({
          id: row.itemId,
          dishId: row.dishId,
          quantity: row.quantity,
          price: row.price,
          dish: {
            id: row.dish.id,
            name: row.dish.name,
            description: row.dish.description,
            image: row.dish.image || "",
          },
        });
      }
    });

    const formattedOrders = Array.from(ordersMap.values());

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      count: formattedOrders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
} 