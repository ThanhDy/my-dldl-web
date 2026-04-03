"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SoulMaster } from "@/data/types"; // Đảm bảo bạn đã có file types này
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import BackToTop from "@/app/components/BackToTop";
import { NeonCard } from "@/app/components/ui/neon-card";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

export default function SoulMasterList({
  initialData,
}: {
  initialData: SoulMaster[];
}) {
  // Không cần state heroes rỗng nữa, dùng luôn dữ liệu Server gửi sang
  const [heroes] = useState<SoulMaster[]>(initialData);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Tất Cả");

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
        {/* Navigation & Header */}
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
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]" />
              <Input
                type="text"
                placeholder="Tìm tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 bg-slate-900/80 border-slate-800 py-2 pl-9 pr-4 text-xs focus-visible:ring-yellow-500/50"
              />
            </div>
            <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
              <SelectTrigger className="w-[140px] bg-slate-900/80 border-slate-800 text-xs font-bold text-slate-400 focus:ring-yellow-500/50">
                <SelectValue placeholder="Phân Loại" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                {types.map((t) => (
                  <SelectItem key={t} value={t} className="text-xs cursor-pointer focus:bg-slate-800 focus:text-white">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid Danh Sách Tướng */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredHeroes.map((hero) => {
            const isSP = hero.rarity.includes("SP");
            const isSSR_Plus = hero.rarity.includes("SSR+");
            const isSSR = hero.rarity === "SSR";
            return (
            <Link href={`/soul-masters/${hero.id}`} key={hero.id} className="w-full group">
              <NeonCard
                glowColor={isSSR_Plus ? "bg-red-600/30" : isSP ? "bg-fuchsia-500/40" : isSSR ? "bg-yellow-500/20" : "bg-slate-700/20"}
                hoverBorderColor={isSSR_Plus ? "hover:border-red-500/80" : isSP ? "hover:border-fuchsia-500/80" : "hover:border-yellow-500/80"}
                className="p-0 border-slate-800/50 rounded-xl overflow-hidden shadow-2xl flex flex-col"
                withSweep={false}
              >
                <div className="relative aspect-[4/5] flex flex-col w-full h-full">
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
                  <p className="text-[12px] font-bold text-yellow-500/80 uppercase ">
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
              </NeonCard>
            </Link>
            );
          })}
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
