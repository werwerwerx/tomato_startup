import { dishes_table, categories_table, img_table } from "@/shared/db/schema";
import db from "@/shared/db";
import { eq } from "drizzle-orm";

export type CatalogItem = {
  id: number;
  name: string;
  img_url: string;
  dishes: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    img_url: string;
  }>;
}

export const getCatalog = async (): Promise<CatalogItem[]> => {
  const categoriesWithImgCTE = db.$with("categoriesWithImg").as(
    db
      .select({
        id: categories_table.id,
        name: categories_table.name,
        img_url:
          img_table.url ??
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVLDP5s2j9u1x86fOb7kNKXanJeMn8zZ30ZQ&s",
      })
      .from(categories_table)
      .innerJoin(img_table, eq(img_table.id, categories_table.imgId)),
  );

  const results = await db
    .with(categoriesWithImgCTE)
    .select({
      categoryId: categoriesWithImgCTE.id,
      categoryName: categoriesWithImgCTE.name,
      categoryImgUrl: categoriesWithImgCTE.img_url,
      dishId: dishes_table.id,
      dishName: dishes_table.name,
      dishDescription: dishes_table.description,
      dishPrice: dishes_table.price,
      dishImgUrl: img_table.url,
    })
    .from(categoriesWithImgCTE)
    .innerJoin(
      dishes_table,
      eq(dishes_table.categoryId, categoriesWithImgCTE.id)
    )
    .innerJoin(img_table, eq(img_table.id, dishes_table.imgId));

  // Group dishes by category
  const categoriesMap = new Map<number, CatalogItem>();
  
  for (const row of results) {
    if (!categoriesMap.has(row.categoryId)) {
      categoriesMap.set(row.categoryId, {
        id: row.categoryId,
        name: row.categoryName,
        img_url: row.categoryImgUrl ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVLDP5s2j9u1x86fOb7kNKXanJeMn8zZ30ZQ&s",
        dishes: [],
      });
    }
    
    const category = categoriesMap.get(row.categoryId)!;
    category.dishes.push({
      id: row.dishId,
      name: row.dishName,
      description: row.dishDescription,
      price: row.dishPrice,
      img_url: row.dishImgUrl ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVLDP5s2j9u1x86fOb7kNKXanJeMn8zZ30ZQ&s",
    });
  }

  return Array.from(categoriesMap.values());
};
