import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Lấy đường dẫn hiện tại
  const path = request.nextUrl.pathname;

  // Chỉ canh gác các đường dẫn bắt đầu bằng /admin
  if (path.startsWith("/admin")) {
    // Kiểm tra và lấy "thẻ bài" (cookie)
    const tokenCookie = request.cookies.get("admin_token");
    const token = tokenCookie?.value;
    const secret = process.env.ADMIN_JWT_SECRET || "";

    // Xác thực cookie đã ký số mã hóa
    const isValid = await verifySessionToken(token, secret);

    // Nếu không hợp lệ -> Đá về trang login
    if (!isValid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Cấu hình matcher để middleware chỉ chạy trên các route cần thiết
export const config = {
  matcher: ["/admin/:path*"],
};
