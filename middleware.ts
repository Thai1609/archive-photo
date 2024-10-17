import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log('Middleware is running');

  const token = req.cookies.get("token"); // Lấy token từ cookies
  const loginUrl = new URL('/auth/login', req.url);
   if (!token && req.nextUrl.pathname !== '/auth/login') {
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next(); // Cho phép tiếp tục nếu token hợp lệ
}

 export const config = {
  matcher: [
    '/auth/:path*', // Chỉ áp dụng cho trang /auth và các trang con
    '/((?!_next/static|_next/image|favicon.ico).*)', // Loại trừ các tệp tĩnh
  ],};
