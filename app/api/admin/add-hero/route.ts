import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  // 1. Bảo mật: Chỉ cho phép chạy ở Localhost (Development)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Tính năng này bị khóa trên môi trường Production!" },
      { status: 403 },
    );
  }

  try {
    const newHero = await request.json();
    // Lọc bỏ các kỹ năng rỗng (Không có tên thì coi như không tồn tại)
    newHero.skillDetails = newHero.skillDetails.filter(
      (skill: any) => skill.name && skill.name.trim() !== "",
    );

    if (newHero.soulBones) {
      // Lọc bỏ hồn cốt không có tên
      newHero.soulBones = newHero.soulBones.filter(
        (bone: any) => bone.name && bone.name.trim() !== "",
      );

      // Dọn dẹp dữ liệu thừa dựa trên lựa chọn
      newHero.soulBones = newHero.soulBones.map((bone: any) => {
        // Sao chép object để xử lý
        const cleanBone = { ...bone };

        if (cleanBone._extraType === "none") {
          delete cleanBone.mutation;
          delete cleanBone.upgrade;
        } else if (cleanBone._extraType === "mutation") {
          delete cleanBone.upgrade; // Giữ mutation, xóa upgrade
        } else if (cleanBone._extraType === "upgrade") {
          delete cleanBone.mutation; // Giữ upgrade, xóa mutation
        }

        // Xóa biến tạm dùng cho UI
        delete cleanBone._extraType;

        return cleanBone;
      });
    }
    // --- KHÁC BIỆT Ở ĐÂY: Ghi vào file riêng ---
    const dirPath = path.join(process.cwd(), "data", "heroes");
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${newHero.id}.json`);

    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `ID ${newHero.id} đã tồn tại!` },
        { status: 400 },
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(newHero, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi ghi file hệ thống." },
      { status: 500 },
    );
  }
}
