import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { UserType } from "@/db/models/user";

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
    with: {
      company: {
        columns: {
          created_at: false,
          updated_at: false,
        },
      },
      seeker: {
        columns: {
          created_at: false,
          updated_at: false,
        },
      },
      experience: {
        with: {
          skill: {
            columns: {
              created_at: false,
              updated_at: false,
            },
          },
        },
        columns: {
          created_at: false,
          updated_at: false,
        },
      },
    },
    where: eq(table.user.id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const updateUser = async (id: string, body: UserType) => {
  const [user] = await db
    .update(table.user)
    .set(body)
    .where(eq(table.user.id, id))
    .returning();

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

export const createUser = async (body: UserType) => {
  const newUser = await db.insert(table.user).values(body);

  return newUser;
};

export const deleteUser = async (id: string) => {
  const user = await db.delete(table.user).where(eq(table.user.id, id));

  if (!user) throw new Error("User not found");

  return user;
};
