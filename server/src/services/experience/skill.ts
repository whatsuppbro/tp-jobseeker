import db from "@/db";
import { skill } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getSkillByExperience = async (id: string) => {
  const result = await db.query.skill.findMany({
    where: eq(skill.experience_id, id),
  });

  return { message: "Get skill by experience", data: result };
};
