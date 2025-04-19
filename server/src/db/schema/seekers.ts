import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { application } from "./application";
import { skill } from "./skill";
import { experience } from "./experience";

export const seeker = pgTable("seeker", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull()
    .unique(),
  resume_url: text("resume_url"),
  phonenumber: text("phone_number"),
  address: text("address"),
  city: text("city"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const seekerRelations = relations(seeker, ({ one, many }) => ({
  user: one(user, {
    fields: [seeker.user_id],
    references: [user.id],
  }),
  experience: one(experience, {
    fields: [seeker.id],
    references: [experience.seeker_id],
  }),
  applications: many(application),
  skills: many(skill),
}));
