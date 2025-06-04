import db from "@/shared/db";
import { categories_table, img_table } from "@/shared/db/schema";
import { eq } from "drizzle-orm";

export type MenuItem = {
  id: number;
  name: string;
  img_url: string | null;
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  return await db
    .selectDistinct({
      id: categories_table.id,
      name: categories_table.name,
      img_url: img_table.url ?? null,
    })
    .from(img_table)
    .innerJoin(categories_table, eq(img_table.id, categories_table.imgId));
};
