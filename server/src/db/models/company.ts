import { t } from "elysia";

export const CompanyModel = t.Object({
  user_id: t.String({ error: "User ID is required" }),
  image_url: t.String(),
  company_name: t.String({ error: "Company name is required" }),
  company_description: t.String({ error: "Company description is required" }),
  company_website: t.String({ error: "Company website is required" }),
  company_email: t.String({ error: "Company email is required" }),
  company_phone: t.String({ error: "Company phone is required" }),
  company_address: t.String({ error: "Company address is required" }),
  company_city: t.String({ error: "Company city is required" }),
  company_country: t.String({ error: "Company country is required" }),
  is_verified: t.Boolean({ default: false }),
  verified_at: t.Optional(t.String()),
});

export const CompanyAdminModel = t.Object({
  image_url: t.String(),
  company_name: t.String({ error: "Company name is required" }),
  company_description: t.Optional(t.String()),
  company_website: t.Optional(t.String()),
  company_email: t.String({ error: "Company email is required" }),
  company_phone: t.Optional(t.String()),
  company_address: t.Optional(t.String()),
  company_city: t.Optional(t.String()),
  company_country: t.Optional(t.String()),
});

export const CompanyCreateModel = t.Object({
  company_name: t.String({ error: "Company name is required" }),
  company_email: t.String({ error: "Company email is required" }),
  company_phone: t.String({ error: "Company phone is required" }),
  company_website: t.String({ error: "Company website is required" }),
  company_description: t.String({ error: "Company description is required" }),
  company_address: t.String({ error: "Company address is required" }),
  company_city: t.String({ error: "Company city is required" }),
  company_country: t.String({ error: "Company country is required" }),
  is_verified: t.Boolean({ default: false }),
  verified_at: t.Optional(t.String()),
});

export type CompanyType = typeof CompanyModel.static;
export type CompanyAdminType = typeof CompanyAdminModel.static;
