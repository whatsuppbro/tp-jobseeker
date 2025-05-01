import Elysia from "elysia";
import {
  getVerifiedById,
  getVerifiedByCompany,
  updateVerified,
  createVerified,
} from "@/services/company/verification";
import { getAllVerified } from "@/services/company/verification/index";
import { VerifiedType, VerificationModel } from "@/db/models/verification";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";

const controller = "verification";

export const verificationController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/:id`, async ({ params }) => {
      try {
        const verified = await getVerifiedById(params.id);
        return SuccessHandler(verified);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/company/:id`, async ({ params }) => {
      try {
        const verified = await getVerifiedByCompany(params.id);
        return SuccessHandler(verified);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .put(
      "/:id",
      async ({ params, body }) => {
        try {
          const verified = await updateVerified(params.id, body);
          return SuccessHandler(verified);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: VerificationModel,
      }
    )
    .post(
      `/`,
      async ({ body }) => {
        try {
          const verified = await createVerified(body);
          return SuccessHandler(verified);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      { body: VerificationModel }
    )
    .get(`/`, async () => {
      try {
        const verified = await getAllVerified();
        return SuccessHandler(verified);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
);
