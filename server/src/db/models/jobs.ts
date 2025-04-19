import { t } from "elysia";

export const JobModel = t.Object({
  company_id: t.String({ error: "Company ID is required" }),
  title: t.String({ error: "Title is required" }),
  description: t.String({ error: "Description is required" }),
  location: t.String({ error: "Location is required" }),
  salary: t.String({ error: "Salary is required" }),
  job_type: t.String({ error: "Job type is required" }),
});

export type JobType = typeof JobModel.static;
