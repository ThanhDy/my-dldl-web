import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Chỉ chạy ở Localhost" },
      { status: 403 }
    );
  }

  try {
    const updatedHero = await request.json();

    // 1. Dọn dẹp dữ liệu rỗng trước khi lưu (Giống trang Add)
    updatedHero.skillDetails = updatedHero.skillDetails.filter(
      (s: any) => s.name && s.name.trim() !== ""
    );

    if (updatedHero.soulBones) {
      updatedHero.soulBones = updatedHero.soulBones.filter(
        (b: any) => b.name && b.name.trim() !== ""
      );
      updatedHero.soulBones = updatedHero.soulBones.map((bone: any) => {
        const cleanBone = { ...bone };
        if (cleanBone._extraType === "none") {
          delete cleanBone.mutation;
          delete cleanBone.upgrade;
        } else if (cleanBone._extraType === "mutation") {
          delete cleanBone.upgrade;
        } else if (cleanBone._extraType === "upgrade") {
          delete cleanBone.mutation;
        }
        delete cleanBone._extraType;
        return cleanBone;
      });
    }

    // --- KHÁC BIỆT: Ghi đè file riêng ---
    const filePath = path.join(
      process.cwd(),
      "data",
      "heroes",
      `${updatedHero.id}.json`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Không tìm thấy tướng này để sửa!" },
        { status: 404 }
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(updatedHero, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi ghi file" }, { status: 500 });
  }
}
