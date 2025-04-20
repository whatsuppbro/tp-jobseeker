import Elysia from "elysia";
import {
  getSeekers,
  getSeekerById,
  getSeekerByUserId,
  createSeeker,
  updateSeeker,
  deleteSeeker,
} from "@/services/seekers";
import { getSkillBySeeker, updateSkill } from "@/services/seekers/skill";
import { SeekerModel } from "@/db/models/seekers";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";

const controller = "seeker";

export const seekerController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/`, async () => {
      try {
        const seekers = await getSeekers();
        return SuccessHandler(seekers);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .get(`/:id`, async ({ params }) => {
      try {
        const seeker = await getSeekerById(params.id);
        if (!seeker) {
          throw new Error("Seeker not found");
        }
        return SuccessHandler(seeker);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/user/:id`, async ({ params }) => {
      try {
        const seeker = await getSeekerByUserId(params.id);
        if (!seeker) {
          throw new Error("Seeker not found");
        }
        return SuccessHandler(seeker);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .get(`/skill/:id`, async ({ params }) => {
      try {
        const seeker = await getSkillBySeeker(params.id);
        if (!seeker) {
          throw new Error("Seeker not found");
        }
        return SuccessHandler(seeker);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .put(
      "/:id",
      async ({ params, body }) => {
        try {
          const parsedBody = SeekerModel.parse(body);
          const seeker = await updateSeeker(params.id, parsedBody);
          if (!seeker) {
            throw new Error("Seeker not found");
          }
          return SuccessHandler(seeker);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: SeekerModel,
      }
    )
    .put("/skill/:id", async ({ params, body }) => {
      try {
        const parsedBody = SeekerModel.parse(body);
        const seeker = await updateSkill(params.id, parsedBody);
        if (!seeker) {
          throw new Error("Seeker not found");
        }
        return SuccessHandler(seeker);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
);
