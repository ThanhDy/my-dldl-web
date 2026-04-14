import React from "react";
import dbConnect from "@/lib/mongodb";
import HungThuSoulRing from "@/models/HungThuSoulRing";
import HungThuSoulRingClient from "./HungThuSoulRingClient";
import { HungThuSoulRing as IHungThuSoulRing } from "@/data/types";

export const revalidate = 3600; // Cache for 1 hour

async function getHungThuData(): Promise<IHungThuSoulRing[]> {
  await dbConnect();
  // Fetch and sort by system and name
  const items = await HungThuSoulRing.find({}).sort({ system: 1, name: 1 });
  return JSON.parse(JSON.stringify(items));
}

export default async function HonHoanHungThuPage() {
  const data = await getHungThuData();

  return (
    <HungThuSoulRingClient initialData={data} />
  );
}

export function generateMetadata() {
  return {
    title: "Danh Sách Hồn Hoàn Hung Thú - DLDL Wiki",
  };
}
