import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action } = body;

    // Xử lý Đăng xuất
    if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete("admin_token");
      return NextResponse.json({ success: true, message: "Đã đăng xuất" });
    }

    // Xử lý Đăng nhập
    if (password === process.env.ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      const secret = process.env.ADMIN_JWT_SECRET || "";

      // Tạo cookie token đã ký mã hóa thay vì giá trị tĩnh "true"
      const token = await generateSessionToken(secret);

      cookieStore.set("admin_token", token, {
        httpOnly: true, // JS không đọc được (bảo mật tránh XSS)
        secure: process.env.NODE_ENV === "production", // Chỉ chạy trên HTTPS khi ở môi trường production
        maxAge: 60 * 60 * 24 * 7, // Lưu đăng nhập 7 ngày
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      // Trì hoãn phản hồi 2 giây để chống brute-force từ bot tự động
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(
        { success: false, message: "Sai mật khẩu!" },
        { status: 401 }
      );
    }
  } catch (error) {
    // Trì hoãn phản hồi khi lỗi
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
