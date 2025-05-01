import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { verification } from "./verification";
import { admin } from "./admin";

export const verificationHistory = pgTable("verification_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  verification_id: uuid("verification_id")
    .references(() => verification.id, { onDelete: "cascade" })
    .notNull(),
  admin_id: uuid("admin_id")
    .references(() => admin.id)
    .notNull(),
  action: text("action", { 
    enum: ["approve", "reject", "request_more_info"] 
  }).notNull(),
  reason: text("reason"),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const verificationHistoryRelations = relations(verificationHistory, ({ one }) => ({
  verification: one(verification, {
    fields: [verificationHistory.verification_id],
    references: [verification.id],
  }),
  admin: one(admin, {
    fields: [verificationHistory.admin_id],
    references: [admin.id],
  }),
})); 