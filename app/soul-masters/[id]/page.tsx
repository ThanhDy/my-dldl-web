export const revalidate = 60; // Web sẽ kiểm tra dữ liệu mới mỗi 60 giây
export const dynamicParams = true;

import dbConnect from "@/lib/mongodb";
import SoulMaster from "@/models/SoulMaster";
import HeroDetailClient from "@/app/components/HeroDetailClient"; // Component Client chúng ta đã sửa nãy giờ
import { notFound } from "next/navigation";

async function getHeroById(id: string) {
  await dbConnect();

  // Dùng decodeURIComponent để xử lý trường hợp ID có ký tự đặc biệt hoặc khoảng trắng
  const decodedId = decodeURIComponent(id);

  console.log("Đang tìm tướng với ID:", decodedId); // LOG KIỂM TRA

  const hero = await SoulMaster.findOne({ id: decodedId }).lean();

  if (!hero) {
    console.log("-> KHÔNG TÌM THẤY TRONG DB");
    return null;
  }

  return JSON.parse(JSON.stringify(hero));
}

export async function generateStaticParams() {
  await dbConnect();
  // Chỉ lấy trường 'id' để tiết kiệm query
  const heroes = await SoulMaster.find({}, { id: 1 }).lean();

  return heroes.map((hero: any) => ({
    id: hero.id,
  }));
}

// Cập nhật kiểu dữ liệu cho props params
export default async function HeroDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15: params là Promise
}) {
  // BẮT BUỘC: Phải await params trước khi dùng
  const { id } = await params;

  const hero = await getHeroById(id);

  if (!hero) {
    return notFound();
  }

  return <HeroDetailClient hero={hero} />;
}
