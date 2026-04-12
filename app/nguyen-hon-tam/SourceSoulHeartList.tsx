"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Filter, 
  ChevronRight,
  LayoutGrid,
  Zap,
  User,
  Hexagon
} from "lucide-react";
import { SourceSoulHeart } from "@/data/types";
import SourceSoulHeartModal from "@/app/nguyen-hon-tam/SourceSoulHeartModal";
import { NeonCard } from "@/app/components/ui/neon-card";
import { Input } from "@/app/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinary } from "@/lib/utils";
import BackToTop from "@/app/components/BackToTop";

const rarities = ["Tất cả", "SP", "SSR", "SSR+"];
const types = [
  "Tất cả",
  "Cường Công",
  "Mẫn Công",
  "Khống Chế",
  "Phụ Trợ/Phòng Ngự",
];

export default function SourceSoulHeartPage({ 
  initialData 
}: { 
  initialData: SourceSoulHeart[] 
}) {
  const [items] = useState<SourceSoulHeart[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("Tất cả");
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [selectedItem, setSelectedItem] = useState<SourceSoulHeart | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredList = items.filter((item) => {
    const matchName = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCharacter = item.character
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchRarity =
      selectedRarity === "Tất cả" || item.rarity === selectedRarity;
    const matchType =
      selectedType === "Tất cả" ||
      (selectedType === "Phụ Trợ/Phòng Ngự"
        ? item.type === "Phụ Trợ" || item.type === "Phòng Ngự"
        : item.type === selectedType);

    return (matchName || matchCharacter) && matchRarity && matchType;
  });

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 relative font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020617_100%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <SourceSoulHeartModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

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
              className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-blue-500/30 backdrop-blur-md"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight pb-2">
                NGUYÊN HỒN TÂM
              </h1>
            </div>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col gap-4 w-full md:w-auto"
          >
            <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={16} />
              <Input
                type="text"
                placeholder="Tìm kiếm Nguyên Hồn Tâm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/60 border-white/10 py-6 pl-12 pr-4 text-xs rounded-2xl focus-visible:ring-purple-500/50 backdrop-blur-xl transition-all"
              />
            </div>
          </motion.div>
        </div>

        {/* Filter Chips */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="mb-12 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Filter size={12} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bộ lọc</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {rarities.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${selectedRarity === r ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"}`}
              >
                {r}
              </button>
            ))}
            <div className="w-px h-8 bg-white/5 mx-2 hidden md:block" />
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${selectedType === t ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/[0.02] rounded-[2rem] border border-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Grid Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredList.map((item, index) => {
              const isSP = item.rarity === "SP" || item.rarity === "SP+";
              const isSSR_Plus = item.rarity === "SSR+";
              const isSSR = item.rarity === "SSR";

              const rarityStyles = isSP 
                ? "bg-gradient-to-tr from-fuchsia-500 to-indigo-600 border-white/30"
                : isSSR_Plus 
                  ? "bg-red-600 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  : isSSR 
                    ? "bg-amber-500 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    : "bg-slate-700 border-slate-500";

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer"
                >
                  <NeonCard
                    glowColor={isSP ? "bg-fuchsia-500/20" : isSSR_Plus ? "bg-red-500/20" : "bg-amber-500/10"}
                    hoverBorderColor={isSP ? "hover:border-fuchsia-500/50" : isSSR_Plus ? "hover:border-red-500/50" : "hover:border-amber-500/50"}
                    className="p-0 border-white/5 rounded-[2rem] overflow-hidden flex flex-col bg-slate-950/40 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-slate-950/60 shadow-2xl"
                    withSweep={false}
                  >
                    <div className="relative aspect-square flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_100%)]">
                      {/* Rarity */}
                      <div className="absolute top-4 right-4 z-20">
                          <span className={`px-2 py-0.5 rounded-lg font-black text-[9px] uppercase shadow-2xl border ${rarityStyles}`}>
                            {item.rarity}
                          </span>
                      </div>

                      {/* Avatar */}
                      <div className="relative w-24 h-24 mb-4 group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-blue-500/50 transition-colors shadow-2xl">
                          <Image
                            src={optimizeCloudinary(item.avatar, 200) || item.avatar}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="w-full text-center space-y-1">
                        <h3 className="text-xs font-black uppercase tracking-tight text-white italic truncate group-hover:text-blue-400 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 opacity-50 transition-opacity group-hover:opacity-100">
                           <User size={10} className="text-slate-400 group-hover:text-blue-400" />
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate group-hover:text-slate-300">
                             {item.character || "Unknown"}
                           </p>
                        </div>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-y-0 translate-y-2">
                           <div className="h-px w-8 bg-blue-500/50 mx-auto" />
                        </div>
                      </div>
                    </div>
                  </NeonCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filteredList.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-slate-600 gap-4"
          >
            <div className="p-8 bg-white/[0.02] rounded-full border border-white/5">
               <Sparkles size={48} className="opacity-10" />
            </div>
            <p className="font-black uppercase tracking-widest text-sm italic">Không tìm thấy dữ liệu nguyên hồn tâm</p>
          </motion.div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
