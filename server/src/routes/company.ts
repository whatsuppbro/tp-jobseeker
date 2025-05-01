import { eq } from "drizzle-orm";
import { db } from "../db";
import { table } from "../db/schema";
import { CompanyModel, CompanyCreateModel } from "../db/models/company";
import { Elysia, t } from "elysia";

export const companyRoutes = new Elysia({ prefix: "/company" })
  .put("/:id/verify", async ({ params, body }) => {
    try {
      const { id } = params;
      const { is_verified, verified_at } = body as { is_verified: boolean; verified_at: string };

      const updatedCompany = await db
        .update(table.company)
        .set({
          is_verified,
          verified_at,
        })
        .where(eq(table.company.id, id))
        .returning();

      if (!updatedCompany.length) {
        throw new Error("Company not found");
      }

      return {
        status: "success",
        data: updatedCompany[0],
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Failed to verify company",
      };
    }
  }); 