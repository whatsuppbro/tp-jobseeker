import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { CompanyType } from "@/db/models/company";
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

export const getCompanyById = async (id: string) => {
  const company = await db.query.company.findFirst({
    where: eq(table.company.id, id),
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

export const updateCompany = async (id: string, body: Partial<CompanyType>) => {
  const company = await db
    .update(table.company)
    .set(body)
    .where(eq(table.company.id, id));

  if (!company) throw new Error("Company not found");

  return company;
};

export const deleteCompany = async (id: string) => {
  const company = await db
    .delete(table.company)
    .where(eq(table.company.id, id));

  if (!company) throw new Error("Company not found");

  return company;
};
