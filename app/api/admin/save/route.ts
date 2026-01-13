import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  // 1. Chỉ cho phép chạy trên Localhost (An toàn tuyệt đối)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Chỉ được sửa dữ liệu ở Localhost!" },
      { status: 403 }
    );
  }

  try {
    // 2. Lấy dữ liệu mới từ Form gửi lên
    const newData = await request.json();

    // 3. Xác định đường dẫn file
    // process.cwd() trỏ về thư mục gốc của dự án
    const filePath = path.join(process.cwd(), "data", "soulMasters.json");

    // 4. Ghi đè file cũ bằng dữ liệu mới
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Đã lưu file thành công!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi ghi file" }, { status: 500 });
  }
}
