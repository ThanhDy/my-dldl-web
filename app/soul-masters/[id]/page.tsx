import { getHeroById } from "@/lib/hero-data";
import HeroDetailClient from "./HeroDetailClient";
import { notFound } from "next/navigation";

// Đây là Server Component (Không có "use client")
export default async function HeroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Lấy ID (Next.js 15)
  const { id } = await params;

  // 2. Đọc dữ liệu trực tiếp từ file (Nhanh hơn gọi API qua HTTP)
  const hero = await getHeroById(id);

  // 3. Nếu không có thì trả về trang 404
  if (!hero) {
    return notFound();
  }

  // 4. Truyền dữ liệu xuống Client Component để hiển thị
  return <HeroDetailClient hero={hero} />;
}
