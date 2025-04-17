import { t } from "elysia";

export const SeekerModel = t.Object({
  user_id: t.String({ error: "User ID is required" }),
  phonenumber: t.String(),
  address: t.String(),
  city: t.String(),
  resume_url: t.String(),
});

export type SeekerType = typeof SeekerModel.static;
