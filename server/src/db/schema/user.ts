import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { seeker, experience } from ".";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ one, many }) => ({
  seeker: one(seeker, {
    fields: [user.id],
    references: [seeker.user_id],
  }),
  experience: one(experience, {
    fields: [user.id],
    references: [experience.user_id],
  }),
}));
