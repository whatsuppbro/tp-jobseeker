import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";

export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  company_name: text("company_name").notNull(),
  position: text("position").notNull(),
  description: text("description"),
});

export const experienceRelations = relations(experience, ({ one }) => ({
  seeker: one(user, {
    fields: [experience.user_id],
    references: [user.id],
  }),
}));
