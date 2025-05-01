import { eq } from "drizzle-orm";
import { table } from "../db/schema";
import { db } from "../db/db";

.post("/", async ({ body }) => {
  try {
    // Check if company is verified
    const company = await db.query.company.findFirst({
      where: eq(table.company.id, body.company_id),
    });

    if (!company) {
      throw new Error("Company not found");
    }

    if (!company.is_verified) {
      throw new Error("Company must be verified before posting jobs");
    }

    const newJob = await db.insert(table.jobs).values(body).returning();

    return {
      status: "success",
      data: newJob[0],
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to create job",
    };
  }
}); 