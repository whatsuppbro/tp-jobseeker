import db from "@/db";
import { eq } from "drizzle-orm";
import { verification } from "@/db/schema";
import { VerifiedType } from "@/db/models/verification";

export const getVerifiedById = async (id: string) => {
  const result = await db.query.verification.findFirst({
    where: eq(verification.company_id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  if (!result) throw new Error("Verification not found");
  return result;
};

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

export const updateVerified = async (
  id: string,
  body: Partial<VerifiedType>
) => {
  const result = await db
    .update(verification)
    .set(body)
    .where(eq(verification.id, id))
    .returning()
    .execute();

  return { message: "Update verified", data: result[0] };
};

export const updateVerifiedStatus = async (
  id: string,
  status: "verified" | "pending" | "rejected"
) => {
  const result = await db
    .update(verification)
    .set({ status })
    .where(eq(verification.id, id))
    .returning()
    .execute();

  return { message: "Update verified status", data: result[0] };
};

export const createVerified = async (body: VerifiedType) => {
  const result = await db
    .insert(verification)
    .values(body)
    .returning()
    .execute();
  return { message: "Create verified", data: result[0] };
};
