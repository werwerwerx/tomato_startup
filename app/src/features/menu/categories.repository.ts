import db from "@/shared/db";
import { categories_table, img_table } from "@/shared/db/schema";
import { eq } from "drizzle-orm";

export const getMenuItems = async () => {
  return await db
    .selectDistinct({
      id: categories_table.id,
      name: categories_table.name,
      img_url: img_table.url,
    })
    .from(img_table)
    .innerJoin(categories_table, eq(img_table.id, categories_table.imgId));
};