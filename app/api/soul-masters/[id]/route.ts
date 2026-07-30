// app/api/soul-masters/[id]/route.ts
import dbConnect from "@/lib/mongodb";
import SoulMaster from "@/models/SoulMaster";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Lọc làm sạch payload
    const updateData = { ...body };
    const unsetData: any = {};

    if (
      updateData.id !== "ninh-vinh-vinh-sp" ||
      !hasRealContent(updateData.nvvCardSystem)
    ) {
      delete updateData.nvvCardSystem;
      unsetData.nvvCardSystem = "";
    }

    if (
      updateData.rarity !== "Thần Chỉ" ||
      !hasRealContent(updateData.divineSystem)
    ) {
      delete updateData.divineSystem;
      unsetData.divineSystem = "";
    }

    const optionalFields = ["vuHonChanThan", "seventhSkill", "eighthSkill", "ninthSkill"];
    for (const field of optionalFields) {
      if (!hasRealContent(updateData[field])) {
        delete updateData[field];
        unsetData[field] = "";
      }
    }

    const updateQuery: any = { $set: updateData };
    if (Object.keys(unsetData).length > 0) {
      updateQuery.$unset = unsetData;
    }

    // Tìm và update (new: true để trả về dữ liệu sau khi sửa)
    const updatedHero = await SoulMaster.findOneAndUpdate({ id: id }, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updatedHero) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy" },
        { status: 404 },
      );
    }

    // Revalidate soul masters list and detail pages
    revalidatePath("/soul-masters");
    revalidatePath(`/soul-masters/${id}`);
    if (updatedHero && updatedHero.id !== id) {
      revalidatePath(`/soul-masters/${updatedHero.id}`);
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

    // Revalidate soul masters list and detail pages
    revalidatePath("/soul-masters");
    revalidatePath(`/soul-masters/${id}`);

    return NextResponse.json({ success: true, message: "Đã xóa thành công" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
