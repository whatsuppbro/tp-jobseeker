import Elysia from "elysia";
// import { UserModel } from "@/db/models/user";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  deleteUser,
} from "@/services/user";
import { UserModel } from "@/db/models/user";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";

const controller = "user";

export const userController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/`, async () => {
      try {
        const users = await getUsers();
        return SuccessHandler(users);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .get(`/:id`, async ({ params }) => {
      try {
        const user = await getUserById(params.id);
        if (!user) {
          throw new Error("User not found");
        }
        return SuccessHandler(user);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .post(
      "/login",
      async ({ body }) => {
        try {
          const { email, password } = body;
          const user = await getUserByEmail(email);

          if (!user || !(await Bun.password.verify(password, user.password))) {
            throw new Error("Invalid email or password");
          }

          return SuccessHandler({
            success: true,
            message: "Login successful",
            user: {
              id: user.id,
              email,
              role: user.role,
            },
          });
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: t.Object({
          email: t.String(),
          password: t.String({ minLength: 6 }),
        }),
      }
    )

    .post(
      "/register",
      async ({ body }) => {
        try {
          const hashedPassword = await Bun.password.hash(body.password, {
            algorithm: "bcrypt",
            cost: 4,
          });

          const user = await createUser({
            ...body,
            password: hashedPassword,
          });

          return SuccessHandler(user);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: UserModel,
      }
    )
    .delete(
      "/:id",
      async ({ params }) => {
        try {
          const user = await deleteUser(params.id);
          return SuccessHandler(user);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      }
    )
);
