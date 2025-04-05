import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";

export const getUsers = async () => {
  const users = await db.query.user.findMany({
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  return users;
};

export const getUserById = async (id: string) => {
  const user = await db.query.user.findFirst({
    where: eq(table.user.id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await db.query.user.findFirst({
    where: eq(table.user.email, email),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};

// export const createUser = async (body: UserType) => {
//   const validatedBody = UserModel.parse(body);

//   const result = await db.transaction(async (tx) => {
//     const [created] = await tx
//       .insert(table.user)
//       .values(validatedBody)
//       .returning();

//     if (!created) throw new Error("Failed to create user");

//     return created;
//   });

//   return result;
// };

// export const updateUser = async (id: string, body: UserType) => {
//   const result = await db.transaction(async (tx) => {
//     const [updated] = await tx
//       .update(table.user)
//       .set({
//         email: body.email || undefined,
//       })
//       .where(eq(table.user.id, id))
//       .returning();

//     if (!updated) throw new Error("Failed to update user");

//     return updated;
//   });

//   return result;
// };

// export const deleteUser = async (id: string) => {
//   const result = await db.transaction(async (tx) => {
//     const [deleted] = await tx
//       .delete(table.user)
//       .where(eq(table.user.id, id))
//       .returning();

//     if (!deleted) throw new Error("Failed to delete user");

//     return deleted;
//   });

//   return result;
// };
