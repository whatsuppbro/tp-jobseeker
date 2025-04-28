import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { JobType } from "@/db/models/jobs";

export const getJobs = async () => {
  const jobs = await db.query.jobs.findMany({
    with: {
      company: true,
      applications: true,
    },
    columns: {
      
      updated_at: false,
    },
  });
  return jobs;
};

export const getAllJobs = async () => {
  const jobs = await db.query.jobs.findMany({
    columns: {
      updated_at: false,
    },
  });
  return jobs;
};

export const getJobsById = async (id: string) => {
  const jobs = await db.query.jobs.findFirst({
    where: eq(table.jobs.id, id),
    with: {
      company: true,
      applications: { with: { user: true } },
    },
    columns: {
      updated_at: false,
    },
  });
  if (!jobs) throw new Error("Jobs not found");

  return jobs;
};

export const getJobsByCompanyId = async (companyId: string) => {
  const jobs = await db.query.jobs.findMany({
    where: eq(table.jobs.company_id, companyId),
    with: {
      company: true,
      applications: {
        with: { user: true },
      },
    },
    columns: {
      updated_at: false,
    },
  });
  if (!jobs) throw new Error("Jobs not found");

  return jobs;
};

export const createJobs = async (data: JobType) => {
  const newJobs = await db.insert(table.jobs).values(data);

  return newJobs;
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
  try {
    await db.delete(table.application).where(eq(table.application.job_id, id));

    const deletedJob = await db
      .delete(table.jobs)
      .where(eq(table.jobs.id, id))
      .returning();

    return deletedJob;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw new Error(
      "Failed to delete job. Please check for dependent records."
    );
  }
};
