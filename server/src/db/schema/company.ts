import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { jobs } from "./jobs";

export const company = pgTable("company", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull()
    .unique(),
  company_name: text("company_name").notNull(),
  company_description: text("company_description"),
  company_website: text("company_website"),
  company_email: text("company_email").notNull(),
  company_phone: text("company_phone"),
  company_address: text("company_address"),
  company_city: text("company_city"),
  company_country: text("company_country"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const companyRelations = relations(company, ({ one, many }) => ({
  user: one(user, {
    fields: [company.user_id],
    references: [user.id],
  }),
  jobs: many(jobs),
}));
