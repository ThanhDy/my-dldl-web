import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BoneBurning from "@/models/BoneBurning";

export async function GET() {
  try {
    await dbConnect();
    const items = await BoneBurning.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { type, levels } = body;

    if (!type || !levels) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Upsert by type
    const item = await BoneBurning.findOneAndUpdate(
      { type },
      { type, levels },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
