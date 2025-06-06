import { t } from "elysia";

export const SkillModel = t.Object({
  seeker_id: t.String(),
  name: t.String(),
});

export type SkillType = typeof SkillModel.static;
