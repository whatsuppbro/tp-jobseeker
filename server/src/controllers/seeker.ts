import Elysia from "elysia";
import {
  getSeekers,
  getSeekerById,
  getSeekerByUserId,
  createSeeker,
  createSeekerWithUserId,
  updateSeeker,
} from "@/services/seekers";
import {
  getSkillBySeeker,
  updateSkill,
  createSkillBySeekerId,
} from "@/services/seekers/skill";
import { SeekerModel } from "@/db/models/seekers";
import { SkillModel } from "@/db/models/skill";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";
import {
  getEducationBySeeker,
  createEducationBySeekerId,
  updateEducation,
} from "@/services/seekers/education";
import { EducationModel } from "@/db/models/education";
import { education } from "@/db/schema";
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
          const seeker = await updateSeeker(params.id, { ...body });
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
    .put(
      "/skill/:id",
      async ({ params, body }) => {
        try {
          const seeker = await updateSkill(params.id, { ...body });
          if (!seeker) {
            throw new Error("Seeker not found");
          }
          return SuccessHandler(seeker);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: SkillModel,
      }
    )

    .post(
      `/`,
      async ({ body }) => {
        try {
          const parsedBody = SeekerModel.parse(body);
          const seeker = await createSeeker(parsedBody);
          return SuccessHandler(seeker);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: SeekerModel,
      }
    )

    .post(`/user/:id`, async ({ params }) => {
      try {
        const seeker = await createSeekerWithUserId(params.id);
        if (!seeker) {
          throw new Error("Seeker not found");
        }
        return SuccessHandler(seeker);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .post(
      `/skill/:id`,
      async ({ params, body }) => {
        try {
          const seeker = await createSkillBySeekerId(params.id, { ...body });
          if (!seeker) {
            throw new Error("Seeker not found");
          }
          return SuccessHandler(seeker);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: SkillModel,
      }
    )
    .post(
      `/education/:id`,
      async ({ params, body }) => {
        try {
          const seeker = await createEducationBySeekerId(params.id, {
            ...body,
          });
          if (!seeker) {
            throw new Error("Seeker not found");
          }
          return SuccessHandler(seeker);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: EducationModel,
      }
    )
    .get(`/education/:id`, async ({ params }) => {
      try {
        const seeker = await getEducationBySeeker(params.id);
        if (!seeker) {
          throw new Error("Seeker not found");
        }
        return SuccessHandler(seeker);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .put(
      "/education/:id",
      async ({ params, body }) => {
        try {
          const seeker = await updateEducation(params.id, { ...body });
          if (!seeker) {
            throw new Error("Seeker not found");
          }
          return SuccessHandler(seeker);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: EducationModel,
      }
    )
);
