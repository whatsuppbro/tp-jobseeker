import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { seeker } from "./seekers";
import { relations } from "drizzle-orm";

export const skill = pgTable("skill", {
  id: uuid("id").primaryKey().defaultRandom(),
  seeker_id: uuid("seeker_id")
    .references(() => seeker.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const skillRelations = relations(skill, ({ one }) => ({
  seeker: one(seeker, {
    fields: [skill.seeker_id],
    references: [seeker.id],
  }),
}));
