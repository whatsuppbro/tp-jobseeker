import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { experience } from "./experience";

export const skill = pgTable("skill", {
  id: uuid("id").primaryKey().defaultRandom(),
  experience_id: uuid("experience_id")
    .references(() => experience.id)
    .notNull()
    .unique(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const skillRelations = relations(skill, ({ one }) => ({
  experience: one(experience, {
    fields: [skill.experience_id],
    references: [experience.id],
  }),
}));
