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

export const userLoginModel = t.Object({
  email: t.String(),
  password: t.String(),
});

export type UserLoginType = typeof userLoginModel.static;
