import React, { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import HungThuSoulRing from "@/models/HungThuSoulRing";
import HungThuSoulRingClient from "./HungThuSoulRingClient";
import HungThuSkeleton from "./HungThuSkeleton";
import { HungThuSoulRing as IHungThuSoulRing } from "@/data/types";

export const revalidate = 3600; // Cache for 1 hour

async function HungThuContent() {
  await dbConnect();
  // Sử dụng .lean() để tăng tốc độ và chuyển đổi sang JSON chuẩn
  const items = await HungThuSoulRing.find({})
    .sort({ system: 1, name: 1 })
    .lean();
  
  // Serialize dữ liệu cho Client Component
  const data = JSON.parse(JSON.stringify(items)) as IHungThuSoulRing[];

  return <HungThuSoulRingClient initialData={data} />;
}

export default function HonHoanHungThuPage() {
  return (
    <Suspense fallback={<HungThuSkeleton />}>
      <HungThuContent />
    </Suspense>
  );
}

export function generateMetadata() {
  return {
    title: "Danh Sách Hồn Hoàn Hung Thú - DLDL Wiki",
  };
}
