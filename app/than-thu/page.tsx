import React from "react";
import dbConnect from "@/lib/mongodb";
import ThanThu from "@/models/ThanThu";
import ThanThuClient from "./ThanThuClient";
import { ThanThu as IThanThu } from "@/data/types";

export const dynamic = "force-dynamic";

async function getThanThuData() {
  await dbConnect();
  const items = await ThanThu.find({}).sort({ name: 1 }).lean();
  
  return JSON.parse(JSON.stringify(items)).map((item: any) => ({
    ...item,
    id: item.id || item._id.toString()
  })) as IThanThu[];
}

export default async function ThanThuPage() {
  const data = await getThanThuData();

  return (
    <main>
      <ThanThuClient initialData={data} />
    </main>
  );
}

export function generateMetadata() {
  return {
    title: "Danh Sách Thần Thú - DLDL Wiki",
  };
}