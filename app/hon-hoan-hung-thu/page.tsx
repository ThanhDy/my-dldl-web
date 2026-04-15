import React from "react";
import dbConnect from "@/lib/mongodb";
import HungThuSoulRing from "@/models/HungThuSoulRing";
import HungThuSoulRingClient from "./HungThuSoulRingClient";
import { HungThuSoulRing as IHungThuSoulRing } from "@/data/types";

export const revalidate = 3600; // Cache for 1 hour

async function getHungThuData() {
  await dbConnect();
  // Sử dụng .lean() để tăng tốc độ và chuyển đổi sang JSON chuẩn
  const items = await HungThuSoulRing.find({})
    .sort({ system: 1, name: 1 })
    .lean();
  
  // Serialize dữ liệu cho Client Component và đảm bảo có trường id từ _id
  return JSON.parse(JSON.stringify(items)).map((item: any) => ({
    ...item,
    id: item._id.toString()
  })) as IHungThuSoulRing[];
}

export default async function HonHoanHungThuPage() {
  const data = await getHungThuData();

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Chưa có dữ liệu</h2>
          <p className="text-slate-400">Vui lòng quay lại sau.</p>
        </div>
      </div>
    );
  }

  return <HungThuSoulRingClient initialData={data} />;
}

export function generateMetadata() {
  return {
    title: "Danh Sách Hồn Hoàn Hung Thú - DLDL Wiki",
  };
}
