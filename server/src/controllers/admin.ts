import Elysia from "elysia";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";
import { AdminModel } from "@/db/models/admin";
import { getAdminByEmail, createAdmin } from "@/services/admin";

const controller = "admin";

export const adminController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .post(
      `/adminlogin`,
      async ({ body }) => {
        try {
          const { email, password } = body;
          const admin = await getAdminByEmail(email);

          if (
            !admin ||
            !(await Bun.password.verify(password, admin.password))
          ) {
            throw new Error("Invalid email or password");
          }
          return SuccessHandler(admin);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: AdminModel,
      }
    )
    .post(
      `/adminregister`,
      async ({ body }) => {
        try {
          const hashedPassword = await Bun.password.hash(body.password, {
            algorithm: "bcrypt",
            cost: 4,
          });

          const newAdmin = await createAdmin({
            ...body,
            password: hashedPassword,
          });
          return SuccessHandler(newAdmin);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: AdminModel,
      }
    )
);
