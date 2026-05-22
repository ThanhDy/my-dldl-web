import dbConnect from "@/lib/mongodb";
import KhacAnSystem from "@/models/KhacAnSystem";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  await dbConnect();
  try {
    const data = await KhacAnSystem.find({}).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    if (!body.id || !body.type) {
      return NextResponse.json({ success: false, message: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const updated = await KhacAnSystem.findOneAndUpdate(
      { id: body.id },
      body,
      { new: true, upsert: true }
    );

    // Làm mới cache tự động để user thấy liền
    revalidatePath("/khac-an-hon-cot");
    revalidatePath("/admin/khac-an-hon-cot");

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}