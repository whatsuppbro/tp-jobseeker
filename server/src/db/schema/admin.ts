import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  is_admin: boolean("is_admin").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
