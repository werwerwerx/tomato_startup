import db from "@/shared/db";
import { menu_table, img_table } from "@/shared/db/schema";
import { eq } from "drizzle-orm";

export const getMenuItems = async () => {
  return await db
    .selectDistinct({
      id: menu_table.id,
      name: menu_table.name,
      img_url: img_table.url,
    })
    .from(img_table)
    .innerJoin(menu_table, eq(img_table.id, menu_table.imgId));
};