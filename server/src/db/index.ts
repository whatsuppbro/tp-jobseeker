import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ??
  (() => {
    throw new Error("DATABASE_URL is not defined");
  })();

export const db = drizzle(new Pool({ connectionString }), { schema });

export const client = postgres(connectionString, { prepare: false });

export default drizzle(new Pool({ connectionString }), { schema });
