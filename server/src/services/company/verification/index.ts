import db from "@/db";
import { eq } from "drizzle-orm";
import { verification } from "@/db/schema";
import { VerifiedType } from "@/db/models/verification";

export const getVerifiedByCompany = async (id: string) => {
  const result = await db.query.verification.findMany({
    where: eq(verification.company_id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  return { message: "Get verified by company", data: result };
};
