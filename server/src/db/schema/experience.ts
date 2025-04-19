import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { skill } from "./skill";

export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull()
    .unique(),
  company_name: text("company_name").notNull(),
  position: text("position").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const experienceRelations = relations(experience, ({ one, many }) => ({
  seeker: one(user, {
    fields: [experience.user_id],
    references: [user.id],
  }),
  skill: many(skill),
}));
