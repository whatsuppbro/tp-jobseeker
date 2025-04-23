import { t } from "elysia";

export const VerificationModel = t.Object({
  company_id: t.String({ error: "Company ID is required" }),
  verified_url: t.String({ error: "Verified URL is required" }),
  status: t.Enum(
    { unverified: "unverified", verified: "verified" },
    { message: "Status is required" }
  ),
});

export type VerifiedType = typeof VerificationModel.static;
