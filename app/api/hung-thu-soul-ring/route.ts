import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HungThuSoulRing from "@/models/HungThuSoulRing";

export async function GET() {
  try {
    await dbConnect();
    const items = await HungThuSoulRing.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Sanitize ObjectId fields: nếu là chuỗi rỗng thì chuyển thành null hoặc xóa đi
    if (body.suitableWithId === "") body.suitableWithId = null;
    if (body.componentIds && Array.isArray(body.componentIds)) {
      body.componentIds = body.componentIds.filter((id: string) => id !== "");
      if (body.componentIds.length === 0) body.componentIds = null;
    }

    console.log("Saving HungThuSoulRing:", JSON.stringify(body, null, 2));
    
    if (body.id) {
        // Update
        const updated = await HungThuSoulRing.findByIdAndUpdate(body.id, body, { 
          new: true,
          runValidators: true // Đảm bảo validation enum cho systems array vẫn hoạt động
        });
        console.log("Update success:", updated?.id);
        return NextResponse.json({ success: true, data: updated });
    } else {
        // Create
        const newItem = await HungThuSoulRing.create(body);
        console.log("Create success:", newItem.id);
        return NextResponse.json({ success: true, data: newItem });
    }
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
