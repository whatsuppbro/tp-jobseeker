import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { company } from "./company";
import { relations } from "drizzle-orm";
import { application } from "./application";

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  company_id: uuid("company_id")
    .references(() => company.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  salary: text("salary").notNull(),
  job_type: text("job_type").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(company, {
    fields: [jobs.company_id],
    references: [company.id],
  }),
  applications: many(application),
}));
