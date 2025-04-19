import Elysia from "elysia";
import {
  getExperience,
  getExperienceById,
  getExperienceByUserId,
  getExperienceWithSkill,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/services/experience";
import { ExperienceModel } from "@/db/models/experience";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";
import { getSkillByExperience } from "../services/experience/skill";

const controller = "experience";

export const experienceController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/`, async () => {
      try {
        const experience = await getExperienceWithSkill();
        return SuccessHandler(experience);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .get(`/:id`, async ({ params }) => {
      try {
        const experience = await getExperienceById(params.id);
        if (!experience) {
          throw new Error("Experience not found");
        }
        return SuccessHandler(experience);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .get(`/user/:id`, async ({ params }) => {
      try {
        const experience = await getExperienceByUserId(params.id);
        if (!experience) {
          throw new Error("Experience not found");
        }
        return SuccessHandler(experience);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .delete("/:id", async ({ params }) => {
      try {
        const experience = await deleteExperience(params.id);
        if (!experience) {
          throw new Error("Experience not found");
        }
        return SuccessHandler(experience);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .get(`/skill/:id`, async ({ params }) => {
      try {
        const experience = await getExperienceById(params.id);
        if (!experience) {
          throw new Error("Experience not found");
        }
        const skills = await getSkillByExperience(params.id);
        return SuccessHandler(skills);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
);
