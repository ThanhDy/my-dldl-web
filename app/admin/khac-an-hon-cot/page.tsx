import React from "react";
import dbConnect from "@/lib/mongodb";
import KhacAnSystem from "@/models/KhacAnSystem";
import AdminKhacAnClient from "./AdminKhacAnClient";

export const revalidate = 0; 

export default async function AdminKhacAnPage() {
  await dbConnect();
  

  const systems = await KhacAnSystem.find({}).lean();
  const data = JSON.parse(JSON.stringify(systems));

  return <AdminKhacAnClient initialData={data} />;
}