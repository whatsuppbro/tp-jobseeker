import db from "@/db";
import { skill } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SkillType } from "@/db/models/skill";

export const getSkillBySeeker = async (id: string) => {
  const result = await db.query.skill.findMany({
    where: eq(skill.seeker_id, id),
  });

  return { message: "Get skill by experience", data: result };
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
