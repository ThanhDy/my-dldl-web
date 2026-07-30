// app/api/soul-masters/route.ts
import dbConnect from "@/lib/mongodb"; // Import hàm kết nối DB (đã tạo ở bước 3)
import SoulMaster from "@/models/SoulMaster"; // Import Model (vừa tạo ở bước 4)
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

function hasRealContent(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string" && val.trim() !== "") return true;
    if (typeof val === "number" && !isNaN(val)) return true;
    if (typeof val === "boolean" && val === true) return true;
    if (Array.isArray(val) && val.length > 0) return true;
    if (typeof val === "object" && val !== null && hasRealContent(val)) return true;
  }
  return false;
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

    // Lọc làm sạch dữ liệu trước khi lưu
    if (
      body.id !== "ninh-vinh-vinh-sp" ||
      !hasRealContent(body.nvvCardSystem)
    ) {
      delete body.nvvCardSystem;
    }

    if (
      body.rarity !== "Thần Chỉ" ||
      !hasRealContent(body.divineSystem)
    ) {
      delete body.divineSystem;
    }

    const optionalFields = ["vuHonChanThan", "seventhSkill", "eighthSkill", "ninthSkill"];
    for (const field of optionalFields) {
      if (!hasRealContent(body[field])) {
        delete body[field];
      }
    }

    // Tạo bản ghi mới
    const newHero = await SoulMaster.create(body);

    // Revalidate soul masters list page on-demand
    revalidatePath("/soul-masters");

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
