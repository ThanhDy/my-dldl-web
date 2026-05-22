import React from "react";
import dbConnect from "@/lib/mongodb";
import KhacAnSystem from "@/models/KhacAnSystem";
import KhacAnClient from "./KhacAnClient";
import { KhacAnSystem as KhacAnSystemType } from "@/data/types";

export const revalidate = 60;

export default async function KhacAnHonCotPage() {
  await dbConnect();
  
  const systems = await KhacAnSystem.find({}).lean();
  const data = JSON.parse(JSON.stringify(systems)) as KhacAnSystemType[];

  return <KhacAnClient initialData={data} />;
}