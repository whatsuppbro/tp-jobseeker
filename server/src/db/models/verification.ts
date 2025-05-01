import { t } from "elysia";

export const VerificationModel = t.Object({
  company_id: t.String({ error: "Company ID is required" }),
  verified_url: t.String({ error: "Verified URL is required" }),
  verified_description: t.Optional(t.String()),
  document_url: t.Optional(t.String()),
  document_type: t.Optional(t.Enum(
    { business_license: "business_license", tax_id: "tax_id", 
      company_registration: "company_registration", other: "other" }
  )),
  rejection_reason: t.Optional(t.String()),
  status: t.Enum(
    { unverified: "unverified", pending: "pending", 
      verified: "verified", rejected: "rejected" },
    { message: "Status is required" }
  ),
});

export type VerifiedType = typeof VerificationModel.static;
