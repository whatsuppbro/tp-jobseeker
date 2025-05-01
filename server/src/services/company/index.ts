import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { CompanyType, CompanyAdminType } from "@/db/models/company";
import { VerifiedType } from "@/db/models/verification";
import { t } from "elysia";

export const getCompanies = async () => {
  const companies = await db.query.company.findMany({
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  return companies;
};

export const getComapiesAndVerification = async () => {
  const companies = await db.query.company.findMany({
    with: {
      verified: {
        columns: {
          created_at: false,
          updated_at: false,
        },
      },
    },
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  return companies;
};

export const getCompanyById = async (id: string) => {
  const company = await db.query.company.findFirst({
    where: eq(table.company.id, id),
    with: {
      verified: {
        columns: {
          status: true,
        },
      },
    },
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!company) throw new Error("Company not found");

  return company;
};

export const getCompanyByUserId = async (userId: string) => {
  const company = await db.query.company.findFirst({
    where: eq(table.company.user_id, userId),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!company) throw new Error("Company not found");

  return company;
};

export const createCompany = async (body: CompanyType) => {
  const newCompany = await db.insert(table.company).values(body);

  return newCompany;
};

export const createCompanyByUserId = async (
  userId: string,
  body: Omit<CompanyType, "user_id">
) => {
  const newCompany = await db.insert(table.company).values({
    ...body,
    user_id: userId,
  });

  return newCompany;
};

export const updateCompany = async (
  id: string,
  body: Omit<CompanyType, "user_id">
) => {
  console.log("Updating company with ID:", id);
  console.log("Update payload:", body);

  const existingCompany = await db.query.company.findFirst({
    where: eq(table.company.user_id, id),
  });

  if (!existingCompany) {
    throw new Error("Company not found");
  }

  const [updatedCompany] = await db
    .update(table.company)
    .set(body)
    .where(eq(table.company.user_id, id))
    .returning();

  console.log("Updated company:", updatedCompany);

  if (!updatedCompany) {
    throw new Error("Failed to update company");
  }

  return updatedCompany;
};

export const updateCompanyById = async (
  id: string,
  body: Omit<CompanyAdminType, "id" | "user_id">
) => {
  console.log("Updating company with ID:", id);
  console.log("Update payload:", body);
  const existingCompany = await db.query.company.findFirst({
    where: eq(table.company.id, id),
  });

  if (!existingCompany) {
    throw new Error("Company not found");
  }

  const [updatedCompany] = await db
    .update(table.company)
    .set(body)
    .where(eq(table.company.id, id))
    .returning();

  if (!updatedCompany) {
    throw new Error("Failed to update company");
  }

  return updatedCompany;
};

export const deleteCompany = async (id: string) => {
  const company = await db
    .delete(table.company)
    .where(eq(table.company.id, id));

  if (!company) throw new Error("Company not found");

  return company;
};
