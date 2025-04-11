import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { seeker } from "./seekers";

export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  seeker_id: uuid("seeker_id")
    .references(() => seeker.id)
    .notNull(),
  company_name: text("company_name").notNull(),
  position: text("position").notNull(),
  start_date: date("start_date").notNull(),
  end_date: date("end_date"),
  description: text("description"),
});

export const experienceRelations = relations(experience, ({ one }) => ({
  seeker: one(seeker, {
    fields: [experience.seeker_id],
    references: [seeker.id],
  }),
}));
