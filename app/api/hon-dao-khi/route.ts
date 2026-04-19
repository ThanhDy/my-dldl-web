import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import HonDaoKhi from "@/models/HonDaoKhi";

export async function GET() {
  try {
    await dbConnect();
    const items = await HonDaoKhi.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (body.id) {
        // Update
        const updated = await HonDaoKhi.findByIdAndUpdate(body.id, body, { new: true });
        // Trigger revalidation for user page
        revalidatePath("/hon-dao-khi");
        return NextResponse.json({ success: true, data: updated });
    } else {
        // Create
        const newItem = await HonDaoKhi.create(body);
        // Trigger revalidation for user page
        revalidatePath("/hon-dao-khi");
        return NextResponse.json({ success: true, data: newItem });
    }
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
