import { t } from "elysia";

export const VerificationModel = t.Object({
  company_id: t.String({ error: "Company ID is required" }),
  verified_url: t.String({ error: "Verified URL is required" }),
  verified_description: t.Optional(t.String()),
  document_type: t.Optional(
    t.Enum({
      business_license: "business_license",
      tax_id: "tax_id",
      company_registration: "company_registration",
      other: "other",
    })
  ),
  status: t.Enum(
    {
      unverified: "unverified",
      pending: "pending",
      verified: "verified",
      rejected: "rejected",
    },
    { message: "Status is required" }
  ),
});

export const VerificationModelStatus = t.Object({
  status: t.Enum(
    {
      verified: "verified",
      pending: "pending",
      rejected: "rejected",
    },
    { message: "Status is required" }
  ),
});

export type VerifiedType = typeof VerificationModel.static;
export type VerifiedStatusType = typeof VerificationModelStatus.static;
