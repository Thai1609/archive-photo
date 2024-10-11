// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Lấy token từ cookies
  console.log("token: ", token);
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url)); // Chuyển hướng nếu không có token
  }

  return NextResponse.next(); // Cho phép tiếp tục nếu token hợp lệ
}

// Chạy middleware với tất cả các trang
export const config = {
  matcher: ["/:path*"], // Áp dụng cho tất cả các routes
};
