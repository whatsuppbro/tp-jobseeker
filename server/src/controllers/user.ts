import Elysia from "elysia";
// import { UserModel } from "@/db/models/user";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  // createUser,
  // deleteUser,
} from "@/services/user";
import { UserModel, userLoginModel } from "@/db/models/user";
import { t } from "elysia";

const controller = "user";

export const userController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/`, async () => {
      const users = await getUsers();
      return users;
    })
    .get(`/:id`, async ({ params }) => {
      const user = await getUserById(params.id);
      return user;
    })
    .post(
      "/login",
      async ({ body }) => {
        const { email, password } = body;
        const user = await getUserByEmail(email);

        if (!user || user.password !== password) {
          return { success: false, message: "Invalid email or password" };
        }

        return {
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            email,
            role: user.role,
          },
        };
      },
      {
        body: t.Object({
          email: t.String(),
          password: t.String(),
        }),
      }
    )
);

// .post(`/${controller}`, async ({ body }) => {
//   const user = await createUser(body as any);
//   return user;
// });

// .put(
//   `/${controller}/:id`,
//   async ({ params, body }) => {
//     const user = await updateUser(params.id, body);
//     return user;
//   },
//   {
//     body: UserModel,
//   }
// )
// .delete(`/${controller}/:id`, async ({ params }) => {
//   const result = await deleteUser(params.id);
//   return result;
// });
