import db from "@/shared/db";
import { dishes_table, img_table } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
// idk its just for a time in the process of dev i will make a one joining query for catalog. at least  make a types that comfortable using in components.
export const getDishes = async (): Promise<DishPreview[]> => {
  const dishes = await db
    .selectDistinct({
      id: dishes_table.id,
      name: dishes_table.name,
      description: dishes_table.description,
      price: dishes_table.price,
      imageUrl: img_table.url,
      category: dishes_table.categoryId,
    })
    .from(dishes_table)
    .leftJoin(img_table, eq(dishes_table.imgId, img_table.id));
  return dishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    image: dish.imageUrl ?? "",
  }));
};

export type DishPreview = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};
