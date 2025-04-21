import db from "@/db";
import { education } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EducationType } from "@/db/models/education";

export const getEducationBySeeker = async (id: string) => {
  const result = await db.query.education.findMany({
    where: eq(education.seeker_id, id),
  });

  return { message: "Get education by seeker", data: result };
};

export const updateEducation = async (
  id: string,
  body: Partial<EducationType>
) => {
  const result = await db
    .update(education)
    .set(body)
    .where(eq(education.id, id))
    .returning()
    .execute();

  return { message: "Update education", data: result[0] };
};

export const createEducationBySeekerId = async (
  seekerId: string,
  body: Omit<EducationType, "seeker_id">
) => {
  const result = await db
    .insert(education)
    .values({ ...body, seeker_id: seekerId })
    .returning()
    .execute();

  return { message: "Create education", data: result[0] };
};
