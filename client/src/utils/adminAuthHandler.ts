"use server";
import { cookies } from "next/headers";

interface Admin {
  email: string;
  password: string;
  is_admin: boolean;
}

export async function adminAuthHandler(
  action: "adminsignin" | "adminsignout",
  userData?: Admin
) {
  const cookieStore = await cookies();

  if (action === "adminsignin" && userData) {
    if (!userData.is_admin) {
      throw new Error("Unauthorized: User is not an admin");
    }

    const userWithRole = {
      ...userData,
      role: "admin",
    };

    cookieStore.set("user", JSON.stringify(userWithRole), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } else if (action === "adminsignout") {
    cookieStore.delete("user");
  }
}
