import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  const admin = request.cookies.get("admin")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedPaths = ["/signin", "/signup"];
  const adminProtectedPaths = ["/admin"];

  if (protectedPaths.includes(pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (adminProtectedPaths.includes(pathname)) {
    if (admin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }
}
export const config = {
  matcher: ["/signin", "/signup", "/admin"],
};
