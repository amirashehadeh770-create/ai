import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = req.auth;

    if (!session?.user) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const match = pathname.match(/^\/admin\/([^/]+)/);
    const requestedSlug = match?.[1];

    if (requestedSlug && requestedSlug !== session.user.storeSlug) {
      const ownDashboard = new URL(`/admin/${session.user.storeSlug}/dashboard`, req.url);
      return NextResponse.redirect(ownDashboard);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
