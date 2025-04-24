import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { seeker } from "./seekers";
import { relations } from "drizzle-orm";

export const education = pgTable("education", {
  id: uuid("id").primaryKey().defaultRandom(),
  seeker_id: uuid("seeker_id")
    .references(() => seeker.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  school_name: text("school_name").notNull(),
  degree: text("degree").notNull(),
  field_of_study: text("field_of_study"),
  start_date: text("start_date"),
  end_date: text("end_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const educationRelations = relations(education, ({ one }) => ({
  seeker: one(seeker, {
    fields: [education.seeker_id],
    references: [seeker.id],
  }),
}));
