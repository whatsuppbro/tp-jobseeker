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
