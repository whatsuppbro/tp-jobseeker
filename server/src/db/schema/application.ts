import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { jobs } from "./jobs";
import { relations } from "drizzle-orm";

export const application = pgTable("application", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  job_id: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),
  status: text("status", {
    enum: ["pending", "accepted", "rejected"],
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const applicationRelations = relations(application, ({ one }) => ({
  user: one(user, {
    fields: [application.user_id],
    references: [user.id],
  }),
  job: one(jobs, {
    fields: [application.job_id],
    references: [jobs.id],
  }),
}));
