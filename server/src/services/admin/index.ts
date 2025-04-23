import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { AdminType } from "@/db/models/admin";

export const getAdmins = async () => {
  const admins = await db.query.admin.findMany({
    with: {
      user: {
        columns: {
          created_at: false,
          updated_at: false,
        },
        with: {
          seeker: {
            columns: {
              created_at: false,
              updated_at: false,
            },
            with: {
              experience: true,
              skills: true,
              education: true,
            },
          },
        },
      },
    },
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  return admins;
};

export const getAdminById = async (id: string) => {
  const admin = await db.query.admin.findFirst({
    where: eq(table.admin.id, id),
    with: {
      user: {
        columns: {
          created_at: false,
          updated_at: false,
        },
        with: {
          seeker: {
            columns: {
              created_at: false,
              updated_at: false,
            },
            with: {
              experience: true,
              skills: true,
              education: true,
            },
          },
        },
      },
    },
    columns: {
      created_at: false,
      updated_at: false,
    },
  });
  return admin;
};

export const createAdmin = async (admin: AdminType) => {
  const newAdmin = await db.insert(table.admin).values(admin).returning();
  return newAdmin;
};

export const getAdminByEmail = async (email: string) => {
  const admin = await db.query.admin.findFirst({
    where: eq(table.admin.email, email),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!admin) throw new Error("User not found");

  return admin;
};
