import { t } from "elysia";

export const UserModel = t.Object({
  name: t.String(),
  email: t.String(),
  role: t.Enum(
    { user: "user", company: "company" },
    { message: "Role is required" }
  ),
});

export type UserType = typeof UserModel.type;

export const userLoginModel = t.Object({
  email: t.String(),
  password: t.String(),
});

export type UserLoginType = typeof userLoginModel.type;
