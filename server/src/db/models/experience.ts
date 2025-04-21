import { t } from "elysia";

export const ExperienceModel = t.Object({
  seeker_id: t.String(),
  company_name: t.String(),
  position: t.String(),
  experience_years: t.String(),
  description: t.Optional(t.String()),
});

export type ExperienceType = typeof ExperienceModel.static;
