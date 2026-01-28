// app/api/soul-masters/route.ts
import dbConnect from "@/lib/mongodb"; // Import hàm kết nối DB (đã tạo ở bước 3)
import SoulMaster from "@/models/SoulMaster"; // Import Model (vừa tạo ở bước 4)
import { NextResponse } from "next/server";

// 1. HÀM GET: Lấy danh sách tướng từ MongoDB về
export async function GET() {
  await dbConnect(); // Đảm bảo đã kết nối DB

  try {
    // Tìm tất cả bản ghi trong collection SoulMaster
    // .sort({ createdAt: -1 }) nghĩa là lấy cái mới nhất lên đầu
    const heroes = await SoulMaster.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: heroes });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 },
    );
  }
}

// 2. HÀM POST: Thêm tướng mới vào MongoDB (Dùng cho trang Admin)
export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json(); // Lấy dữ liệu từ form gửi lên (body)

    // Kiểm tra dữ liệu cơ bản (Validation đơn giản)
    if (!body.id || !body.name || !body.rarity) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu thông tin bắt buộc (id, name, rarity)",
        },
        { status: 400 },
      );
    }

    // Tạo bản ghi mới
    const newHero = await SoulMaster.create(body);

    return NextResponse.json({ data: newHero }, { status: 201 });
  } catch (error: any) {
    // Xử lý lỗi trùng ID (nếu có)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "ID tướng này đã tồn tại!" },
        { status: 400 },
      );
    }

    console.error("Lỗi thêm mới:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
