import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  // 1. Bảo mật: Chỉ cho phép chạy ở Localhost (Development)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Tính năng này bị khóa trên môi trường Production!" },
      { status: 403 }
    );
  }

  try {
    const newHero = await request.json();
    // Lọc bỏ các kỹ năng rỗng (Không có tên thì coi như không tồn tại)
    newHero.skillDetails = newHero.skillDetails.filter(
      (skill: any) => skill.name && skill.name.trim() !== ""
    );

    if (newHero.soulBones) {
      // Lọc bỏ hồn cốt không có tên
      newHero.soulBones = newHero.soulBones.filter(
        (bone: any) => bone.name && bone.name.trim() !== ""
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
    // Đường dẫn file
    const filePath = path.join(process.cwd(), "data", "soulMasters.json");

    // Đọc dữ liệu cũ
    const fileData = fs.readFileSync(filePath, "utf8");
    const soulMasters = JSON.parse(fileData);

    // Kiểm tra trùng ID
    const exists = soulMasters.find((h: any) => h.id === newHero.id);
    if (exists) {
      return NextResponse.json(
        { error: `ID "${newHero.id}" đã tồn tại!` },
        { status: 400 }
      );
    }

    // Thêm tướng mới vào đầu danh sách (hoặc cuối tùy bạn)
    soulMasters.push(newHero);

    // Ghi lại file
    fs.writeFileSync(filePath, JSON.stringify(soulMasters, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi ghi file hệ thống." },
      { status: 500 }
    );
  }
}
