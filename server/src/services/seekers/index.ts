import { eq } from "drizzle-orm";
import db from "@/db";
import * as table from "@/db/schema";
import { SeekerType } from "@/db/models/seekers";

export const getSeekers = async () => {
  const seekers = await db.query.seeker.findMany({
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  return seekers;
};

export const getSeekerById = async (id: string) => {
  const seeker = await db.query.seeker.findFirst({
    where: eq(table.seeker.id, id),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!seeker) throw new Error("Seeker not found");

  return seeker;
};

export const getSeekerByUserId = async (userId: string) => {
  const seeker = await db.query.seeker.findFirst({
    where: eq(table.seeker.user_id, userId),
    columns: {
      created_at: false,
      updated_at: false,
    },
  });

  if (!seeker) throw new Error("Seeker not found");

  return seeker;
};

export const createSeeker = async (body: SeekerType) => {
  const newSeeker = await db.insert(table.seeker).values(body);

  return newSeeker;
};

export const createSeekerWithUserId = async (userId: string) => {
  const newSeeker = await db.insert(table.seeker).values({ user_id: userId });

  if (!newSeeker) throw new Error("Seeker not found");

  return newSeeker;
};

export const updateSeeker = async (id: string, body: Partial<SeekerType>) => {
  const seeker = await db
    .update(table.seeker)
    .set(body)
    .where(eq(table.seeker.id, id));

  if (!seeker) throw new Error("Seeker not found");

  return seeker;
};

export const deleteSeeker = async (id: string) => {
  const seeker = await db.delete(table.seeker).where(eq(table.seeker.id, id));

  if (!seeker) throw new Error("Seeker not found");

  return seeker;
};
