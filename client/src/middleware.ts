import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  console.log("user", user);
  const pathname = request.nextUrl.pathname;

  const protectedPaths = ["/signin", "/signup"];

  if (protectedPaths.includes(pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup"],
};
