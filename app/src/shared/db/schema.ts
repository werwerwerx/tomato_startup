import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";



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

export const users_table = pgTable("users", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification_codes_table = pgTable("verification_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  email: text("email").notNull().unique(),
})

export const account_table = pgTable("account", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar_url: text("avatar_url").default("https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"),
  email: text("email").unique(),
  userId: integer("userId").references(() => users_table.id),
  provider: text({enum: ["yandex", "email", "telegram"]}).notNull().default("email"),
})
