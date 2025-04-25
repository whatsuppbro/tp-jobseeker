import { t } from "elysia";

export const AdminModel = t.Object({
  email: t.String({ error: "Email is required" }),
  password: t.String({ error: "Password is required" }),
});

export type AdminType = typeof AdminModel.static;

export const AdminCreateModel = t.Object({
  email: t.String({ error: "Email is required" }),
  password: t.String({ error: "Password is required" }),
  is_admin: t.Boolean({ error: "is_admin is required" }),
});

export type AdminCreateType = typeof AdminCreateModel.static;
