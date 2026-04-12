"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SoulMaster } from "@/data/types";
import { 
  Search, 
  ArrowLeft, 
  Filter, 
  LayoutGrid, 
  Sparkles,
  ChevronRight,
  User
} from "lucide-react";
import BackToTop from "@/app/components/BackToTop";
import { NeonCard } from "@/app/components/ui/neon-card";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinary } from "@/lib/utils";

export default function SoulMasterList({
  initialData,
}: {
  initialData: SoulMaster[];
}) {
  const [heroes] = useState<SoulMaster[]>(initialData);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Tất Cả");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020617_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-blue-500/30"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight pb-2">
                  HỒN SƯ
                </h1>
                <p className="text-slate-500 text-xs md:text-sm font-medium max-w-xl group-hover:text-slate-400 transition-colors">
                  Tra cứu thông tin chi tiết, hệ phái và phẩm chất của các vị hồn sư thống trị Lục địa Đấu La.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            <div className="relative group flex-1 sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
              <Input
                type="text"
                placeholder="Tìm tên nhân vật..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/60 border-white/10 py-5 md:py-6 pl-12 pr-4 text-xs rounded-2xl focus-visible:ring-blue-500/50 backdrop-blur-xl transition-all"
              />
            </div>
            <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
              <SelectTrigger className="w-full sm:w-[160px] bg-slate-900/60 border-white/10 py-5 md:py-6 rounded-2xl text-xs font-black text-slate-400 focus:ring-blue-500/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="opacity-50" />
                  <SelectValue placeholder="Hệ phái" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 backdrop-blur-2xl border-white/10 text-slate-300 rounded-xl">
                {types.map((t) => (
                  <SelectItem key={t} value={t} className="text-xs font-bold cursor-pointer focus:bg-blue-600 focus:text-white rounded-lg m-1">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* Grid Danh Sách Tướng */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHeroes.map((hero, index) => {
              const isSP = hero.rarity?.includes("SP");
              const isSSR_Plus = hero.rarity?.includes("SSR+");
              const isSSR = hero.rarity === "SSR";
              
              const rarityStyles = isSP 
                ? "bg-gradient-to-tr from-rose-500 via-fuchsia-600 to-indigo-600 shadow-fuchsia-500/40 border-white/40"
                : isSSR_Plus 
                  ? "bg-red-600 shadow-red-500/40 border-red-400"
                  : isSSR 
                    ? "bg-amber-500 text-black shadow-amber-500/40 border-amber-300"
                    : "bg-slate-700 shadow-slate-700/40 border-slate-500";

              return (
                <motion.div
                  key={hero.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                  className="group"
                >
                  <Link href={`/soul-masters/${hero.id}`} className="block h-full">
                    <NeonCard
                      glowColor={isSP ? "bg-fuchsia-500/30" : isSSR_Plus ? "bg-red-500/20" : isSSR ? "bg-amber-500/10" : "bg-slate-500/10"}
                      hoverBorderColor={isSP ? "hover:border-fuchsia-500/50" : isSSR_Plus ? "hover:border-red-500/50" : isSSR ? "hover:border-amber-500/50" : "hover:border-slate-500/50"}
                      className="p-0 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col bg-slate-950/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2"
                      withSweep={false}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {/* Rarity Badge */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase shadow-2xl border ${rarityStyles}`}>
                            {hero.rarity}
                          </span>
                        </div>

                        {/* Image */}
                        <Image
                          src={optimizeCloudinary(hero.image, 300) || hero.image}
                          alt={hero.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 15vw"
                        />

                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-80" />
                        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay group-hover:bg-blue-500/10 transition-colors" />

                        {/* Content Info */}
                        <div className="absolute bottom-0 inset-x-0 p-5 space-y-1.5 transition-transform duration-500 group-hover:translate-y-[-4px]">
                          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500 text-white font-black mb-1 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                            <p className="text-[9px] uppercase tracking-widest truncate">
                              {hero.title}
                            </p>
                          </div>
                          <h3 className="text-sm md:text-base font-black text-white tracking-tight uppercase italic leading-none min-h-[1.5em] flex items-end">
                            {hero.name}
                          </h3>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            <span className="text-[8px] font-black tracking-widest uppercase bg-white/5 text-slate-400 px-2.5 py-1 rounded-md border border-white/5 group-hover:bg-white/10 transition-colors">
                              {hero.type}
                            </span>
                             <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                               <ChevronRight size={14} className="text-blue-500" />
                             </div>
                          </div>
                        </div>
                      </div>
                    </NeonCard>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredHeroes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-slate-600 gap-4"
          >
            <div className="p-6 bg-white/[0.02] rounded-full border border-white/5">
               <User size={48} className="opacity-20" />
            </div>
            <p className="font-bold uppercase tracking-widest text-sm italic">Không tìm thấy hồn sư nào phù hợp</p>
            <button 
              onClick={() => { setSearch(""); setSelectedType("Tất Cả"); }}
              className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Làm mới bộ lọc
            </button>
          </motion.div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
