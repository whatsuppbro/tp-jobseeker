import Elysia from "elysia";
import {
  getJobs,
  getJobsById,
  getJobsByCompanyId,
  createJobs,
  updateJobs,
  deleteJobs,
} from "@/services/jobs";
import { JobModel } from "@/db/models/jobs";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";

const controller = "jobs";

export const jobsController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/`, async () => {
      try {
        const jobs = await getJobs();
        return SuccessHandler(jobs);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/:id`, async ({ params }) => {
      try {
        const jobs = await getJobsById(params.id);
        if (!jobs) {
          throw new Error("Jobs not found");
        }
        return SuccessHandler(jobs);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/company/:id`, async ({ params }) => {
      try {
        const jobs = await getJobsByCompanyId(params.id);
        if (!jobs) {
          throw new Error("Jobs not found");
        }
        return SuccessHandler(jobs);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .post(
      `/`,
      async ({ body }) => {
        try {
          const jobs = await createJobs({ ...body });
          if (!jobs) {
            throw new Error("Jobs not found");
          }
          return SuccessHandler(jobs);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: JobModel,
      }
    )
    .put(
      `/:id`,
      async ({ params, body }) => {
        try {
          const jobs = await updateJobs(params.id, { ...body });
          return SuccessHandler(jobs);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: JobModel,
      }
    )
    .delete(
      `/:id`,
      async ({ params }) => {
        try {
          const jobs = await deleteJobs(params.id);
          return SuccessHandler(jobs);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      }
    )
);
