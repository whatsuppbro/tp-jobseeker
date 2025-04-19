import { t } from "elysia";

export const ApplicationModel = t.Object({
  user_id: t.String({ error: "User ID is required" }),
  job_id: t.String({ error: "Job ID is required" }),
  status: t.Enum(
    { pending: "pending", accepted: "accepted", rejected: "rejected" },
    { message: "status is required" }
  ),
});

export type ApplicationType = typeof ApplicationModel.static;
