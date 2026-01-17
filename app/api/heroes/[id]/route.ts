import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  // Sửa kiểu dữ liệu cho Next.js 15: params là Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // QUAN TRỌNG: Phải await params trước khi dùng
    const { id } = await params;

    // In ra ID nhận được để kiểm tra
    console.log("------------------------------------------------");
    console.log("🔍 API Request ID:", id);

    const filePath = path.join(process.cwd(), "data", "heroes", `${id}.json`);

    // In ra đường dẫn file mà code đang cố gắng tìm
    console.log("📂 Đang tìm file tại đường dẫn:", filePath);

    if (!fs.existsSync(filePath)) {
      console.log("❌ Kết quả: File KHÔNG tồn tại!");
      return NextResponse.json(
        { error: `Không tìm thấy file: ${id}.json` },
        { status: 404 }
      );
    }

    console.log("✅ Kết quả: File ĐÃ tìm thấy!");
    const content = fs.readFileSync(filePath, "utf8");
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("🔥 Lỗi API:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
