import db from "@/db";
import { skill } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SkillType } from "@/db/models/skill";

export const getSkillBySeeker = async (id: string) => {
  const result = await db.query.skill.findMany({
    where: eq(skill.seeker_id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  return { message: "Get skill by seeker", data: result };
};

export const getSkillById = async (id: string) => {
  const result = await db.query.skill.findFirst({
    where: eq(skill.seeker_id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  if (!skill) throw new Error("Skill not found");

  return skill;
};

export const updateSkill = async (id: string, body: Partial<SkillType>) => {
  const result = await db
    .update(skill)
    .set(body)
    .where(eq(skill.id, id))
    .returning()
    .execute();

  return { message: "Update skill", data: result[0] };
};

export const createSkillBySeekerId = async (id: string, body: SkillType) => {
  const result = await db.insert(skill).values(body).returning().execute();

  return { message: "Create skill", data: result[0] };
};

export const deleteSkillById = async (id: string) => {
  const result = await db.delete(skill).where(eq(skill.id, id)).execute();

  return { message: "Delete skill", data: result };
};
