import Elysia from "elysia";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  createUser,
  deleteUser,
  updateUserPassword,
  updateUserInformation,
} from "@/services/user";
import { UserModel, UserUpdateModel } from "@/db/models/user";
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

    .put(
      "/:id",
      async ({ params, body }) => {
        try {
          const user = await updateUser(params.id, body);
          return SuccessHandler(user);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: UserModel,
      }
    )

    .put(
      "/password/:id",
      async ({ params, body }) => {
        try {
          const { password, newPassword } = body;
          const user = await getUserById(params.id);
          if (!user) {
            throw new Error("User not found");
          }

          if (!(await Bun.password.verify(password, user.password))) {
            throw new Error("Invalid password");
          }

          const hashedPassword = await Bun.password.hash(newPassword, {
            algorithm: "bcrypt",
            cost: 4,
          });

          const updatedUser = await updateUserPassword(
            params.id,
            hashedPassword
          );
          return SuccessHandler(updatedUser);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          password: t.String(),
          newPassword: t.String({ minLength: 6 }),
        }),
      }
    )

    .put(
      "/information/:id",
      async ({ params, body }) => {
        try {
          const user = await updateUserInformation(params.id, body);
          return SuccessHandler(user);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: UserUpdateModel,
      }
    )

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
