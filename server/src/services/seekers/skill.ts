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
