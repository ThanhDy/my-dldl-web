import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SourceSoulHeart from "@/models/SourceSoulHeart";

/**
 * @description Lấy tất cả Nguyên Hồn Tâm
 */
export async function GET() {
  try {
    await dbConnect();
    const items = await SourceSoulHeart.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error("API_GET_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * @description Tạo Nguyên Hồn Tâm mới
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // Client gửi id rỗng, ta cần loại bỏ nó trước khi tạo
    const { id, ...newItemData } = body;
    const newItem = await SourceSoulHeart.create(newItemData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error("API_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @description Cập nhật một Nguyên Hồn Tâm
 */
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 },
      );
    }

    const updatedItem = await SourceSoulHeart.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
    );

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error("API_PUT_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @description Xóa một Nguyên Hồn Tâm
 */
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for deletion" },
        { status: 400 },
      );
    }

    await SourceSoulHeart.findByIdAndDelete(id);

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error: any) {
    console.error("API_DELETE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
