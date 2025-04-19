import { t } from "elysia";

export const UserModel = t.Object({
  firstname: t.String(),
  lastname: t.String(),
  password: t.String(),
  email: t.String(),
  role: t.Enum(
    { seeker: "seeker", company: "company" },
    { message: "Role is required" }
  ),
});

export type UserType = typeof UserModel.static;
