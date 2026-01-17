import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "data", "heroes");

    // Nếu thư mục chưa có thì trả về rỗng
    if (!fs.existsSync(dirPath)) return NextResponse.json([]);

    const files = fs.readdirSync(dirPath);

    // Đọc từng file nhưng CHỈ LẤY thông tin cơ bản
    const heroes = files.map((file) => {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, "utf8");
      const hero = JSON.parse(content);

      // Payload Optimization: Chỉ trả về cái cần thiết cho trang chủ
      return {
        id: hero.id,
        name: hero.name,
        rarity: hero.rarity,
        type: hero.type,
        image: hero.image,
      };
    });

    return NextResponse.json(heroes);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy danh sách" }, { status: 500 });
  }
}
