// app/api/cloudinary/delete/route.ts

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dom5kcwri", // Tên cloud của bạn
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { public_id, folder } = await req.json();

    // CASE 1: Xóa Folder (Khi xóa Hồn sư)
    if (folder) {
      // 1. Xóa toàn bộ ảnh trong folder đó trước
      await cloudinary.api.delete_resources_by_prefix(folder);
      // 2. Xóa folder rỗng (Bọc try-catch để tránh lỗi nếu folder không tồn tại)
      try {
        await cloudinary.api.delete_folder(folder);
      } catch (err) {
        console.log("Folder delete warning:", err);
      }
      return NextResponse.json({ success: true });
    }

    // CASE 2: Xóa 1 ảnh (Khi edit/add)
    if (!public_id)
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
