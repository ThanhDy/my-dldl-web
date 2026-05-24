import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ThanThu from "@/models/ThanThu";
import { revalidatePath } from "next/cache";

const RARITY_ORDER: Record<string, number> = {
  "SP+": 6,
  "SP": 5,
  "SSR+": 4,
  "SSR": 3,
  "SR": 2,
  "R": 1,
};

const getRarityWeight = (rarity: string) => {
  const r = (rarity || "").toUpperCase().trim();
  return RARITY_ORDER[r] || 0;
};

export async function GET() {
  try {
    await dbConnect();
    const items = await ThanThu.find({});
    
    items.sort((a: any, b: any) => {
      const weightA = getRarityWeight(a.rarity);
      const weightB = getRarityWeight(b.rarity);
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return (a.name || "").localeCompare(b.name || "", "vi");
    });

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