import { t } from "elysia";

export const EducationModel = t.Object({
  seeker_id: t.String(),
  school_name: t.String(),
  degree: t.String(),
  field_of_study: t.String(),
  start_date: t.String(),
  end_date: t.String(),
});

export type EducationType = typeof EducationModel.static;
