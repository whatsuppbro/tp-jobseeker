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

export const UserUpdateModel = t.Object({
  firstname: t.String(),
  lastname: t.String(),
  email: t.String(),
});

export type UserType = typeof UserModel.static;
export type UserUpdateType = typeof UserUpdateModel.static;
