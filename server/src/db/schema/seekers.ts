import { pgTable, uuid, text } from "drizzle-orm/pg-core";
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
});

export const seekerRelations = relations(seeker, ({ one }) => ({
  user: one(user, {
    fields: [seeker.user_id],
    references: [user.id],
  }),
}));
