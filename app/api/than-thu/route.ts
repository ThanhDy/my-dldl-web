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

export async function DELETE() {
  try {
    await dbConnect();
    await ThanThu.deleteMany({});
    
    revalidatePath("/than-thu");
    return NextResponse.json({ message: "Đã xóa toàn bộ thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}