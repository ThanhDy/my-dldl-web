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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Tìm và update (new: true để trả về dữ liệu sau khi sửa)
    const updatedHero = await SoulMaster.findOneAndUpdate({ id: id }, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedHero) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedHero });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// 3. HÀM DELETE: Xóa tướng
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedHero = await SoulMaster.findOneAndDelete({ id: id });

    if (!deletedHero) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Đã xóa thành công" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
