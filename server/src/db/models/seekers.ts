import { t } from "elysia";

export const SeekerModel = t.Object({
  user_id: t.String({ error: "User ID is required" }),
  phonenumber: t.String(),
  address: t.String(),
  city: t.String(),
  certificates: t.String(),
  avatar_url: t.String(),
  resume_url: t.String(),
});

export const CertificateModel = t.Object({
  certificates: t.String(),
});

export type SeekerType = typeof SeekerModel.static;
export type CertificateType = typeof CertificateModel.static;
