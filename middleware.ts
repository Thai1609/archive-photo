import { getToken } from "next-auth/jwt";
import { getSession, useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.SECRET;

export async function middleware(req: NextRequest) {
  console.log("Middleware is running");
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  // Skip public paths like login, register, or API routes
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Get token from next-auth JWT
  const tokenGG = await getToken({ req, secret });

  console.log("token: ", token);
  console.log("tokenGG : ", tokenGG);

   if (!token && pathname !== "/auth/login") {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // // Allow access if the user is authenticated
  // if (tokenGG && token && pathname === "/auth/login") {
  //    return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

   return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Loại trừ các tệp tĩnh
  ],
};
