import React from "react";
import dbConnect from "@/lib/mongodb";
import HonDaoKhi from "@/models/HonDaoKhi";
import HonDaoKhiClient from "./HonDaoKhiClient";
import { HonDaoKhi as IHonDaoKhi } from "@/data/types";

export const revalidate = 3600; // Cache for 1 hour

async function getHonDaoKhiData() {
  await dbConnect();
  const items = await HonDaoKhi.find({})
    .sort({ name: 1 })
    .lean();
  
  return JSON.parse(JSON.stringify(items)).map((item: any) => ({
    ...item,
    id: item._id.toString()
  })) as IHonDaoKhi[];
}

export default async function HonDaoKhiPage() {
  const data = await getHonDaoKhiData();

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

  return <HonDaoKhiClient initialData={data} />;
}

export function generateMetadata() {
  return {
    title: "Danh Sách Hồn Đạo Khí - DLDL Wiki",
  };
}
