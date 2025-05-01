import db from "@/db";
import { eq } from "drizzle-orm";
import { verification } from "@/db/schema";
import { VerifiedType } from "@/db/models/verification";

export const getAllVerified = async () => {
  const result = await db.query.verification.findMany({
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  return { message: "Get all verified", data: result };
};
