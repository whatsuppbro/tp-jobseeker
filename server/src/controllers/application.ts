import Elysia from "elysia";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";
import { ApplicationModel } from "@/db/models/application";
import {
  getApplications,
  getApplicationsById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  createApplications,
  updateApplications,
} from "@/services/application";

const controller = "applications";

export const applicationController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/`, async () => {
      try {
        const applications = await getApplications();
        return SuccessHandler(applications);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/:id`, async ({ params }) => {
      try {
        const applications = await getApplicationsById(params.id);
        if (!applications) {
          throw new Error("Application not found");
        }
        return SuccessHandler(applications);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/user/:id`, async ({ params }) => {
      try {
        const applications = await getApplicationsByUserId(params.id);
        if (!applications) {
          throw new Error("Application not found");
        }
        return SuccessHandler(applications);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/job/:id`, async ({ params }) => {
      try {
        const applications = await getApplicationsByJobId(params.id);
        if (!applications) {
          throw new Error("Application not found");
        }
        return SuccessHandler(applications);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .post(
      `/`,
      async ({ body }) => {
        try {
          const applications = await createApplications({ ...body });
          return SuccessHandler(applications);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: ApplicationModel,
      }
    )
    .put(
      `/:id`,
      async ({ params, body }) => {
        try {
          const applications = await updateApplications(params.id, { ...body });
          return SuccessHandler(applications);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: ApplicationModel,
      }
    )
);
