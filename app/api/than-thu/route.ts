import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ThanThu from "@/models/ThanThu";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await dbConnect();
    const items = await ThanThu.find({}).sort({ rarity: -1, name: 1 });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    if (!body.id && body.name) {
      body.id = body.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9-]/g, "-");
    }
    const newItem = await ThanThu.findOneAndUpdate({ id: body.id }, body, { new: true, upsert: true });
    revalidatePath("/than-thu");
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  // Hàm POST đã sử dụng findOneAndUpdate với upsert: true nên có thể dùng chung logic
  return POST(req);
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await ThanThu.findOneAndDelete({ id });
      revalidatePath("/than-thu");
      return NextResponse.json({ message: `Đã xóa thần thú ${id} thành công` });
    }

    await ThanThu.deleteMany({});
    revalidatePath("/than-thu");
    return NextResponse.json({ message: "Đã xóa toàn bộ thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}