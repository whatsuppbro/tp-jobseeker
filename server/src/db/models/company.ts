import { t } from "elysia";

export const CompanyModel = t.Object({
  user_id: t.String({ error: "User ID is required" }),
  company_name: t.String({ error: "Company name is required" }),
  company_description: t.Optional(t.String()),
  company_website: t.Optional(t.String()),
  company_email: t.String({ error: "Company email is required" }),
  company_phone: t.Optional(t.String()),
  company_address: t.Optional(t.String()),
  company_city: t.Optional(t.String()),
  company_country: t.Optional(t.String()),
});

export type CompanyType = typeof CompanyModel.static;
