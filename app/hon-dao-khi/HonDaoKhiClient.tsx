"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HonDaoKhi } from "@/data/types";
import BackToTop from "@/app/components/BackToTop";
import Image from "next/image";

const DEFAULT_IMAGE = "https://res.cloudinary.com/dom5kcwri/image/upload/v1713080000/hung-thu-soul-rings/placeholder.png";

const formatText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\[[^\]|]+\|[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      const [color, label] = part.slice(1, -1).split("|");
      const colorMap: Record<string, string> = {
        red: "text-rose-500",
        yellow: "text-amber-400",
        blue: "text-blue-400",
        green: "text-emerald-400",
        purple: "text-purple-400",
        orange: "text-orange-500",
        cyan: "text-cyan-400",
        gray: "text-slate-500",
        white: "text-white",
      };
      return (
        <span key={index} className={`font-black ${colorMap[color] || "text-slate-200"}`}>
          {label}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const getBadgeStyle = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("đỏ")) return "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
  if (l.includes("tím")) return "bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
  if (l.includes("vàng")) return "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]";
  return "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
};

interface HonDaoKhiClientProps {
  initialData: HonDaoKhi[];
}

export default function HonDaoKhiClient({ initialData }: HonDaoKhiClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<HonDaoKhi | null>(null);

  const filteredData = useMemo(() => {
    return initialData.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialData, searchQuery]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1b4b_0%,#020617_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-16"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] uppercase font-black tracking-wider bg-white/5 px-4 py-2 rounded-xl border border-white/5"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Trang chủ</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
                Hồn Đạo <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Khí</span>
              </h1>
              <p className="mt-4 text-slate-400 text-sm md:text-base max-w-2xl font-medium">
                Khám phá các bảo vật Hồn Đạo Khí và các mốc hiệu ứng độc quyền giúp gia tăng sức mạnh một cách vượt trội.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-12 max-w-xl">
           <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Tìm kiếm hồn đạo khí..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-sm text-slate-200 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium shadow-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer flex flex-col gap-4"
              >
                {/* Image Container */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl hover:border-blue-500/30 hover:bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 relative aspect-square">
                  <Image 
                    src={item.image || DEFAULT_IMAGE} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    unoptimized 
                  />
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay group-hover:bg-blue-500/10 transition-colors" />
                  
                </div>

                {/* Name below */}
                <div className=" px-2 space-y-1 transition-transform duration-500 group-hover:translate-y-[-2px]">
                  <h3 className="text-xs md:text-sm font-black text-white tracking-tight  leading-tight group-hover:text-blue-400 transition-colors">
                     {item.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredData.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
              <Zap size={40} className="text-slate-600" />
              <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Không tìm thấy hồn đạo khí nào</p>
            </div>
          )}
        </div>
        
        {/* Info Footer */}
        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
              <span className="text-slate-500">© 2026 DLDL Wiki</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-slate-500">Hồn Đạo Khí</span>
           </div>
        </div>
      </div>

      <BackToTop />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#020617] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6 md:p-12 flex flex-col md:flex-row gap-10">
                  {/* Left Column: Image & Basic Info */}
                  <div className="shrink-0 flex flex-col items-center md:items-start md:w-72">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-2 border-white/10 shadow-3xl bg-slate-900 ring-4 ring-blue-500/10">
                      <Image 
                        src={selectedItem.image || DEFAULT_IMAGE} 
                        alt={selectedItem.name} 
                        fill 
                        className="object-cover" 
                        unoptimized 
                      />
                    </div>
                    <h2 className="mt-8 text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight text-center md:text-left">
                      {selectedItem.name}
                    </h2>
                  </div>

                  {/* Right Column: Star Effects */}
                  <div className="flex-1 space-y-6">
                    <div className="pb-4 border-b border-white/5">
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hiệu ứng mốc sao</h3>
                    </div>

                    <div className="space-y-4">
                      {selectedItem.starEffects?.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                          <Zap size={32} className="text-slate-600 mb-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Đang cập nhật dữ liệu</p>
                        </div>
                      ) : (
                        selectedItem.starEffects?.map((eff, index) => (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={index} 
                            className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 hover:border-blue-500/20 transition-all flex flex-col items-start gap-4"
                          >
                            <h4 className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${getBadgeStyle(eff.starLevel)}`}>
                              {eff.starLevel}
                            </h4>
                            <div className="text-slate-300 text-sm md:text-base leading-relaxed font-medium w-full flex flex-col gap-3">
                              {eff.effect ? (
                                eff.effect.split("\n").map((line, lIdx) => {
                                  const isTangLine = line.toLowerCase().includes("tăng:");
                                  return (
                                    <div 
                                      key={lIdx} 
                                      className={isTangLine ? "p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.03)]" : "pl-1"}
                                    >
                                      {formatText(line)}
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-slate-600 italic font-normal">Chưa có thông tin mốc này...</span>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
