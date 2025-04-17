import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { seeker } from "./seekers";
import { user } from "./user";
import { skills } from "./skills";

export const userSkills = pgTable("userSkills", {
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull()
    .unique(),
  skill_id: uuid("skill_id")
    .references(() => skills.id)
    .notNull()
    .unique(),
});

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
  seeker: one(seeker, {
    fields: [userSkills.user_id],
    references: [seeker.user_id],
  }),
  skills: one(skills, {
    fields: [userSkills.skill_id],
    references: [skills.id],
  }),
}));
