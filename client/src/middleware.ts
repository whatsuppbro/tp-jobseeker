import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user");
  const user = userCookie?.value;

  let userData = null;
  if (user) {
    try {
      userData = JSON.parse(user);
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }

  const adminCookie = request.cookies.get("admin");
  const admin = adminCookie?.value;

  let adminData = null;
  if (admin) {
    try {
      adminData = JSON.parse(admin);
    } catch (error) {
      console.error("Error parsing admin cookie:", error);
    }
  }

  const pathname = request.nextUrl.pathname;

  const isAdminRoot = pathname === "/admin";

  const isAdminSubpath =
    pathname.startsWith("/admin/") && pathname !== "/admin";

  const isPublicRoute = ["/signin", "/signup"].includes(pathname);

  if (isAdminRoot) {
    return NextResponse.next();
  }

  if (isAdminSubpath) {
    if (!adminData || adminData.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (userData && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
