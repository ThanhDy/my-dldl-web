export const revalidate = 60; // Đây là Server Component (Mặc định, không có "use client")
import dbConnect from "@/lib/mongodb";
import SoulMaster from "@/models/SoulMaster";
import SoulMasterList from "@/app/components/SoulMasterList"; // Import component vừa tạo
import { SoulMaster as SoulMasterType } from "@/data/types";

// Hàm lấy dữ liệu chạy trực tiếp trên Server (Không qua API HTTP -> Nhanh hơn)
async function getHeroes() {
  await dbConnect();
  // .lean() giúp query nhanh hơn và trả về object thuần
  const heroes = await SoulMaster.find({}).sort({ createdAt: -1 }).lean();

  // Chuyển đổi _id và ngày tháng thành chuỗi để tránh lỗi React
  return JSON.parse(JSON.stringify(heroes)) as SoulMasterType[];
}

export default async function Page() {
  // 1. Server lấy dữ liệu trước
  const heroes = await getHeroes();

  // 2. Server render HTML đã có sẵn dữ liệu và gửi về Client
  return <SoulMasterList initialData={heroes} />;
}
