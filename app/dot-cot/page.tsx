import React from "react";
import dbConnect from "@/lib/mongodb";
import BoneBurning from "@/models/BoneBurning";
import BoneBurningClient from "./BoneBurningClient";
import { BoneBurning as IBoneBurning } from "@/data/types";

export const revalidate = 3600; // Cache for 1 hour

async function getBoneBurningData(): Promise<IBoneBurning[]> {
  await dbConnect();
  const items = await BoneBurning.find({}).sort({ createdAt: 1 });
  
  // Chuyển đổi Mongoose documents thành plain objects để pass sang Client Component
  return JSON.parse(JSON.stringify(items));
}

export default async function BoneBurningPage() {
  const data = await getBoneBurningData();

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

  return <BoneBurningClient initialData={data} />;
}
