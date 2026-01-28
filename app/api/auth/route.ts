import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

      // Tạo "thẻ bài" (Cookie)
      cookieStore.set("admin_token", "true", {
        httpOnly: true, // JS không đọc được (bảo mật)
        secure: process.env.NODE_ENV === "production", // Chỉ chạy trên HTTPS khi deploy
        maxAge: 60 * 60 * 24 * 7, // Lưu đăng nhập 7 ngày
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Sai mật khẩu!" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
