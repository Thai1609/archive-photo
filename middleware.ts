import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middleware is running");

  const { pathname } = req.nextUrl; // Get current path
  const secret = process.env.NEXTAUTH_SECRET;

  // Get tokens
  const token = req.cookies.get("token")?.value;
  const tokenGG = await getToken({ req, secret });

  console.log("token: ", token);
  console.log("tokenGG : ", tokenGG);

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  //  If the user is NOT logged in and tries to access a protected page -> Redirect to login
  if (!token && !tokenGG) {
    if (!pathname.startsWith("/auth")) {
       return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

   if ((token || tokenGG) && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/photos", req.url));
  }

  // Allow access to other pages
  return NextResponse.next();
}

// Apply middleware to all routes except Next.js static files (_next, favicon)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
