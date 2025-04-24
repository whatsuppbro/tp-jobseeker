import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { seeker } from "./seekers";

export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  seeker_id: uuid("seeker_id")
    .references(() => seeker.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  company_name: text("company_name").notNull(),
  position: text("position").notNull(),
  description: text("description"),
  experience_years: text("experience_years"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const experienceRelations = relations(experience, ({ one, many }) => ({
  seeker: one(seeker, {
    fields: [experience.seeker_id],
    references: [seeker.id],
  }),
}));
