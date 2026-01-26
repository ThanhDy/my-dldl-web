"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SoulMaster } from "@/data/types";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import BackToTop from "@/app/components/BackToTop";

export default function SoulMastersPage() {
  const [heroes, setHeroes] = useState<SoulMaster[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Tất Cả");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/heroes")
      .then((res) => res.json())
      .then((data) => setHeroes(data))
      .catch((err) => console.error("Lỗi tải dữ liệu:", err));
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  const types = [
    "Tất Cả",
    "Cường Công",
    "Mẫn Công",
    "Khống Chế",
    "Phụ Trợ",
    "Phòng Ngự",
    "Ám Khí",
  ];

  const filteredHeroes = heroes.filter((hero) => {
    const matchesSearch = hero.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = selectedType === "Tất Cả" || hero.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header thu gọn */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs mb-3 group uppercase font-bold tracking-widest"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
              Tổng quan <span className="text-yellow-500"> hồn sư </span>
            </h1>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]" />
              <input
                type="text"
                placeholder="Tìm tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 bg-slate-900/80 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-yellow-500/50 transition-all"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-900/80 border border-slate-800 rounded-lg py-2 px-3 text-xs font-bold text-slate-400 outline-none cursor-pointer"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredHeroes.map((hero) => (
            <Link
              href={`/soul-masters/${hero.id}`}
              key={hero.id}
              className="group bg-slate-900/40 rounded-xl overflow-hidden border border-slate-800/50 hover:border-yellow-500/50 transition-all shadow-2xl flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase shadow-lg border ${
                      hero.rarity.includes("SSR+")
                        ? "bg-red-600 text-white border-red-400"
                        : hero.rarity.includes("SP")
                          ? "bg-gradient-to-tr from-rose-400 via-fuchsia-500 via-indigo-500 to-cyan-400 text-white border-white/40 shadow-fuchsia-500/50"
                          : hero.rarity === "SSR"
                            ? "bg-yellow-500 text-black border-yellow-400"
                            : "bg-slate-700 text-white border-slate-500"
                    }`}
                  >
                    {hero.rarity}
                  </span>
                </div>

                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-0 inset-x-0 p-3">
                  <p className="text-[8px] font-bold text-yellow-500/80 uppercase tracking-[0.2em] mb-0.5 truncate italic">
                    {hero.title}
                  </p>
                  <h3 className="text-sm font-black text-white  truncate tracking-tight uppercase">
                    {hero.name}
                  </h3>
                  <div className="mt-1.5 flex gap-1">
                    <span className="text-[8px] border border-white/10 px-1.5 py-0.5 rounded bg-black/40 text-slate-500 uppercase font-black">
                      {hero.type}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredHeroes.length === 0 && (
          <div className="text-center py-32 border border-dashed border-slate-800 rounded-3xl backdrop-blur-sm">
            <p className="text-slate-600 italic text-sm font-medium uppercase tracking-widest">
              Không tìm thấy hồn sư phù hợp
            </p>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <BackToTop />

      <style jsx global>{`
        @keyframes sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
