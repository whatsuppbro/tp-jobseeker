import Elysia from "elysia";
// import { UserModel } from "@/db/models/user";
import {
  getUsers,
  getUsersById,
  createUser,
  // deleteUser,
} from "@/services/user";

const controller = "user";

export const userController = new Elysia({
  detail: {
    tags: [controller],
  },
})
  .get(`/${controller}`, async () => {
    const users = await getUsers();
    return users;
  })
  .get(`/${controller}/:id`, async ({ params }) => {
    const user = await getUsersById(params.id);
    return user;
  })

  .post(`/${controller}`, async ({ body }) => {
    const user = await createUser(body as any);
    return user;
  });

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
