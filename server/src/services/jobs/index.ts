import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { JobType } from "@/db/models/jobs";

export const getJobs = async () => {
  const jobs = await db.query.jobs.findMany({
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  return jobs;
};

export const getJobsById = async (id: string) => {
  const jobs = await db.query.jobs.findFirst({
    where: eq(table.jobs.id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  if (!jobs) throw new Error("Jobs not found");

  return jobs;
};

export const getJobsByCompanyId = async (companyId: string) => {
  const jobs = await db.query.jobs.findFirst({
    where: eq(table.jobs.company_id, companyId),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  if (!jobs) throw new Error("Jobs not found");

  return jobs;
};

export const createJobs = async (data: JobType) => {
  const jobs = await db.insert(table.jobs).values(data).returning();
  return jobs;
};

export const updateJobs = async (id: string, data: JobType) => {
  const jobs = await db
    .update(table.jobs)
    .set(data)
    .where(eq(table.jobs.id, id))
    .returning();
  return jobs;
};

export const deleteJobs = async (id: string) => {
  const jobs = await db
    .delete(table.jobs)
    .where(eq(table.jobs.id, id))
    .returning();
  return jobs;
};
