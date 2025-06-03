import { integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";



export const menu_table = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  imgId: integer("imgId").references(() => img_table.id),
});

export const img_table = pgTable("img", {
  id: serial("id").primaryKey(),
  url: text("url").unique(),
});