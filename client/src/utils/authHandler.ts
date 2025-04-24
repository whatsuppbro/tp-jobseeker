"use server";
import { cookies } from "next/headers";

export async function authHandler() {
  const cookieStore = cookies();
}
