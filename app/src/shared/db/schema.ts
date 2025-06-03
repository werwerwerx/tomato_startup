import { integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";



export const categories_table = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  imgId: integer("imgId").references(() => img_table.id),
});

export const img_table = pgTable("img", {
  id: serial("id").primaryKey(),
  url: text("url").unique(),
});


export const dishes_table = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imgId: integer("imgId").references(() => img_table.id),
  categoryId: integer("categoryId").references(() => categories_table.id),
})
