"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Info, 
  ChevronRight,
  Star
} from "lucide-react";
import { ThanThu } from "@/data/types";
import BackToTop from "@/app/components/BackToTop";

interface ThanThuClientProps {
  initialData: ThanThu[];
}

const DEFAULT_IMAGE = "https://res.cloudinary.com/dom5kcwri/image/upload/v1713080000/placeholder.png";

const renderRarityBadge = (rarity: string) => {
  if (!rarity) return null;
  if (rarity === "SP" || rarity === "SP+") {
    return (
      <span className="text-[10px] font-black uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(255,255,255,0.1)] bg-white/5 shrink-0">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-500">{rarity}</span>
      </span>
    );
  }
  let colorClass = "";
  switch (rarity) {
    case "R": colorClass = "text-blue-400 border-blue-400/50 bg-blue-500/10"; break;
    case "SR": colorClass = "text-purple-400 border-purple-400/50 bg-purple-500/10"; break;
    case "SSR": colorClass = "text-yellow-400 border-yellow-400/50 bg-yellow-500/10"; break;
    case "SSR+": colorClass = "text-red-400 border-red-400/50 bg-red-500/10"; break;
    default: colorClass = "text-slate-400 border-slate-400/50 bg-slate-500/10"; break;
  }
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-md shrink-0 ${colorClass}`}>
      {rarity}
    </span>
  );
};

const getRarityTextClass = (rarity: string | undefined) => {
  if (rarity === "SP" || rarity === "SP+") {
    return "text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-500";
  }
  switch (rarity) {
    case "R": return "text-blue-400";
    case "SR": return "text-purple-400";
    case "SSR": return "text-yellow-400";
    case "SSR+": return "text-red-400";
    default: return "text-white";
  }
};

export default function ThanThuClient({ initialData }: ThanThuClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return initialData.filter(item => 
      (selectedRarity === "All" || item.rarity === selectedRarity) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialData, searchQuery, selectedRarity]);

  const selectedItem = useMemo(() => {
    return initialData.find(item => item.id === selectedId);
  }, [initialData, selectedId]);

  useEffect(() => {
    if (filteredData.length > 0 && !selectedId) {
      setSelectedId(filteredData[0].id);
    } else if (filteredData.length === 0) {
      setSelectedId(null);
    }
  }, [filteredData, selectedId]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-yellow-500/30 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#422006_0%,#020617_100%)] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-12"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-yellow-400 transition-all text-[10px] uppercase font-black tracking-wider bg-white/5 px-4 py-2 rounded-xl border border-white/5"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Trang chủ</span>
          </Link>
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
              Danh Sách <span className="text-yellow-500">Thần Thú</span>
            </h1>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 1. List Section (Cột Trái) */}
          <div className="lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {/* Search Bar */}
            <div className="relative mb-4 sticky top-0 z-10 py-2 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Tìm kiếm thần thú..."
                className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl py-4 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 focus:bg-yellow-500/5 transition-all font-medium shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["All", "R", "SR", "SSR", "SSR+", "SP", "SP+"].map(r => (
                <button 
                  key={r}
                  onClick={() => setSelectedRarity(r)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                    selectedRarity === r 
                    ? "bg-yellow-500 border-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {r === "All" ? "Tất cả" : r}
                </button>
              ))}
            </div>

            {/* List Items */}
            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredData.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`
                      p-4 rounded-3xl border cursor-pointer transition-all duration-300 group
                      ${selectedId === item.id 
                        ? "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)]" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 ${selectedId === item.id ? "ring-2 ring-yellow-500/40" : ""}`}>
                        <Image src={item.image || DEFAULT_IMAGE} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-black text-lg capitalize tracking-tighter truncate ${getRarityTextClass(item.rarity)}`}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderRarityBadge(item.rarity || "")}
                        </div>
                      </div>
                      <ChevronRight size={18} className={`text-slate-600 transition-all ${selectedId === item.id ? "translate-x-0 opacity-100 text-yellow-500" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredData.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-wider">Không tìm thấy thần thú</p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Details Section (Cột Phải) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-6 md:p-8 relative overflow-hidden group shadow-2xl"
                >
                  {/* Decoration Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-10">
                    {/* Info Header */}
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      <div className="relative w-32 h-32 shrink-0">
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-black/50">
                          <Image src={selectedItem.image || DEFAULT_IMAGE} alt={selectedItem.name} fill className="object-cover" unoptimized />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h2 className={`text-4xl md:text-5xl font-black capitalize tracking-tighter leading-none ${getRarityTextClass(selectedItem.rarity)}`}>
                          {selectedItem.name}
                        </h2>
                        <div className="flex items-center gap-3 flex-wrap">
                          {renderRarityBadge(selectedItem.rarity || "")}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedItem.description && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent opacity-30" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-yellow-500/60">Mô tả kỹ năng</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-500/50 opacity-30" />
                        </div>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line text-justify px-4">
                          {selectedItem.description}
                        </p>
                      </div>
                    )}

                    {/* Level Effects */}
                    {selectedItem.levelEffects && selectedItem.levelEffects.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                          <span className="w-2 h-6 bg-yellow-500 rounded-full" />
                          Hiệu Ứng Nâng Level
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedItem.levelEffects.map((le, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg shrink-0 w-fit">
                                <span className="text-sm font-black text-yellow-500">Lv.{le.level}</span>
                              </div>
                              <div className="flex-1 text-sm text-slate-300 whitespace-pre-line pt-1">
                                {le.effect || <span className="italic text-slate-500">Chưa có thông tin</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {selectedItem.skills && selectedItem.skills.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                          <span className="w-2 h-6 bg-yellow-500 rounded-full" />
                          Trạng Thái Đặc Biệt
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedItem.skills.map((skill, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3 hover:border-yellow-500/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <h4 className="text-base font-bold text-yellow-400">{skill.name || `Trạng thái ${idx + 1}`}</h4>
                              </div>
                              <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                                {skill.description || <span className="italic text-slate-500">Chưa có mô tả</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] opacity-50">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                    <Info size={30} className="text-slate-600" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Chọn một thần thú bên trái để xem chi tiết
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BackToTop />
      
      <style jsx global>{`
        .scroll-hide::-webkit-scrollbar {
          display: none;
        }
        .scroll-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}