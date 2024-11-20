import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middleware is running");
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  const secret = process.env.NEXTAUTH_SECRET;
  // Get token from next-auth JWT
  const tokenGG = await getToken({ req, secret });

  console.log("token: ", token);
  console.log("tokenGG : ", tokenGG);

  // Allow access if the user is authenticated
  if (tokenGG && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Loại trừ các tệp tĩnh
  ],
};
