import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { SkillType } from "@/db/models/skill";

export const getSkillById = async (id: string) => {
  const skill = await db.query.skill.findFirst({
    where: eq(table.skill.id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  if (!skill) throw new Error("Skill not found");

  return skill;
};
