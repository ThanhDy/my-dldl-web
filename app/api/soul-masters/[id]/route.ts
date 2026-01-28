// app/api/soul-masters/[id]/route.ts
import dbConnect from "@/lib/mongodb";
import SoulMaster from "@/models/SoulMaster";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // Khai báo params là Promise (cho Next.js bản mới)
) {
  try {
    // 1. Kết nối Database
    await dbConnect();

    // 2. Lấy ID từ URL (phải await vì params là Promise)
    const { id } = await params;

    // 3. Tìm tướng trong MongoDB theo custom ID (ví dụ: ninh-vinh-vinh-sp)
    const hero = await SoulMaster.findOne({ id: id }).lean();

    // 4. Nếu không tìm thấy -> Trả về lỗi 404
    if (!hero) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hồn sư này" },
        { status: 404 },
      );
    }

    // 5. Nếu tìm thấy -> Trả về dữ liệu
    return NextResponse.json({ data: hero });
  } catch (error) {
    console.error("Lỗi API chi tiết:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi Server" },
      { status: 500 },
    );
  }
}
