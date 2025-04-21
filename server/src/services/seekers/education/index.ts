import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";

export const getEducationById = async (id: string) => {
  const education = await db.query.education.findFirst({
    where: eq(table.education.id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  if (!education) throw new Error("Education not found");

  return education;
};
