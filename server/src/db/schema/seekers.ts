import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";

export const seeker = pgTable("seeker", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull()
    .unique(),
  phonenumber: text("phone_number"),
  address: text("address"),
  city: text("city"),
  resume_url: text("resume_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const seekerRelations = relations(seeker, ({ one }) => ({
  user: one(user, {
    fields: [seeker.user_id],
    references: [user.id],
  }),
}));
