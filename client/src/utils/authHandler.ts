"use server";
import { cookies } from "next/headers";

interface User {
  id: string;
  name: string;
  role: string;
}

export async function authHandler(
  action: "signin" | "signout",
  userData?: User
) {
  const cookieStore = await cookies();

  if (action === "signin" && userData) {
    const userWithRole = {
      ...userData,
      role: "user",
    };
    cookieStore.set("user", JSON.stringify(userWithRole), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } else if (action === "signout") {
    cookieStore.delete("user");
  }
}
