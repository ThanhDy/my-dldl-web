import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Lấy đường dẫn hiện tại
  const path = request.nextUrl.pathname;

  // Chỉ canh gác các đường dẫn bắt đầu bằng /admin
  if (path.startsWith("/admin")) {
    // Kiểm tra xem có "thẻ bài" (cookie) chưa
    const token = request.cookies.get("admin_token");

    // Nếu không có token -> Đá về trang login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Cấu hình matcher để middleware chỉ chạy trên các route cần thiết
export const config = {
  matcher: ["/admin/:path*"],
};
