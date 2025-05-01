import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { company } from "./company";

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  company_id: uuid("company_id")
    .references(() => company.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  verified_url: text("verified_url").notNull(),
  verified_description: text("verified_description"),
  document_url: text("document_url"),
  document_type: text("document_type", { 
    enum: ["business_license", "tax_id", "company_registration", "other"] 
  }),
  rejection_reason: text("rejection_reason"),
  status: text("status", { 
    enum: ["unverified", "pending", "verified", "rejected"] 
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const verificationRelations = relations(verification, ({ one }) => ({
  company: one(company, {
    fields: [verification.company_id],
    references: [company.id],
  }),
}));
