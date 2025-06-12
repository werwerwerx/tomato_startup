import { auth } from "@/app/auth";
import db from "@/shared/db";
import { favorite, dishes_table, img_table } from "@/shared/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userFavorites = await db
      .select({
        id: favorite.id,
        dishId: favorite.dishId,
        dish: {
          id: dishes_table.id,
          name: dishes_table.name,
          description: dishes_table.description,
          price: dishes_table.price,
          image: img_table.url,
        }
      })
      .from(favorite)
      .leftJoin(dishes_table, eq(favorite.dishId, dishes_table.id))
      .leftJoin(img_table, eq(dishes_table.imgId, img_table.id))
      .where(eq(favorite.userId, session.user.id));

    const formattedFavorites = userFavorites
      .filter(fav => fav.dish) // только те, у которых блюдо существует
      .map(fav => ({
        dishId: fav.dishId,
        dish: fav.dish
      }));

    return NextResponse.json({
      success: true,
      favorites: formattedFavorites,
      count: formattedFavorites.length,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 