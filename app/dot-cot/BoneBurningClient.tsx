"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Flame, 
  ArrowLeft, 
  ChevronRight, 
  Sparkles,
  Zap,
  Shield,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BoneBurning } from "@/data/types";
import BackToTop from "@/app/components/BackToTop";

// Hàm hỗ trợ định dạng chuỗi theo cú pháp [màu|nội dung]
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

const TAB_ICONS: Record<string, any> = {
  "Cường Công": Zap,
  "Mẫn Công": Target,
  "Khống Chế": Sparkles,
  "Phụ Trợ/Phòng Ngự": Shield
};

const TAB_COLORS: Record<string, string> = {
  "Cường Công": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "Mẫn Công": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Khống Chế": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Phụ Trợ/Phòng Ngự": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
};

interface BoneBurningClientProps {
  initialData: BoneBurning[];
}

export default function BoneBurningClient({ initialData }: BoneBurningClientProps) {
  const [activeTab, setActiveTab] = useState<string>(initialData[0]?.type || "");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<Record<string, number>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Khởi tạo mức mở khóa mặc định là cấp 7 (max)
    const initialUnlocks: Record<string, number> = {};
    initialData.forEach((item) => {
      initialUnlocks[item.type] = 7;
    });
    setUnlockedLevels(initialUnlocks);
  }, [initialData]);

  const handleLevelClick = (level: number) => {
    setSelectedLevel(level);
  };

  // Cập nhật selectedLevel khi đổi Tab
  useEffect(() => {
    setSelectedLevel(1);
  }, [activeTab]);

  const currentSystem = initialData.find(s => s.type === activeTab);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-orange-500/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020617_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-16"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Trang chủ</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl italic">
                Hệ Thống <span className="text-orange-500">Đốt Cốt</span> (Nhiên Cốt)
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md">
            {initialData.map((system) => {
              const Icon = TAB_ICONS[system.type] || Zap;
              const isActive = activeTab === system.type;
              
              return (
                <button
                  key={system.type}
                  onClick={() => setActiveTab(system.type)}
                  className={`
                    relative px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 group
                    ${isActive 
                      ? "text-white" 
                      : "text-slate-500 hover:text-slate-300"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-tab-bg"
                      className={`absolute inset-0 rounded-2xl border bg-white/5 ${TAB_COLORS[system.type].split(' ').pop()}`}
                    />
                  )}
                  <Icon size={18} className={`relative z-10 transition-colors ${isActive ? TAB_COLORS[system.type].split(' ')[0] : ""}`} />
                  <span className="relative z-10 text-xs font-black uppercase tracking-tighter italic">{system.type}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {currentSystem && (
              <motion.section 
                key={currentSystem.type}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 mt-10">
                  {/* Level Track (Left) */}
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-hide">
                    {currentSystem.levels.map((lvl) => {
                      const isUnlocked = unlockedLevels[currentSystem.type] >= lvl.level;
                      const isCurrent = selectedLevel === lvl.level;
                      
                      return (
                        <button
                          key={lvl.level}
                          onClick={() => handleLevelClick(lvl.level)}
                          className={`
                            relative shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isCurrent 
                              ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110 z-10" 
                              : isUnlocked 
                                ? "bg-slate-800 text-orange-400 border border-orange-500/30" 
                                : "bg-white/5 text-slate-600 border border-white/5 opacity-40 hover:opacity-100"
                            }
                          `}
                        >
                          <span className="text-xs font-black">{lvl.level === 7 ? "E" : lvl.level}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Level Details (Right) */}
                  <div className="relative min-h-[350px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${currentSystem.type}-${selectedLevel}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden group shadow-2xl"
                      >
                        {/* Decorative Background Icon */}
                        <div className="absolute -bottom-10 -right-10 opacity-[0.03] transform rotate-12 group-hover:scale-110 transition-transform duration-1000">
                           <Flame size={240} />
                        </div>

                        <div className="relative z-10 space-y-8">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/60">Level Unlock</span>
                              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                                {currentSystem.levels.find(l => l.level === selectedLevel)?.levelName}
                              </h3>
                            </div>
                          </div>

                          <div className="h-px w-20 bg-gradient-to-r from-orange-500 to-transparent" />

                          <div className="text-slate-300 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                            {formatText(currentSystem.levels.find(l => l.level === selectedLevel)?.description || "")}
                          </div>

                          {selectedLevel < 7 && unlockedLevels[currentSystem.type] > selectedLevel && (
                            <div className="pt-10">
                               <button 
                                onClick={() => handleLevelClick(selectedLevel + 1)}
                                className="group/btn flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                               >
                                 Tiếp theo: {currentSystem.levels.find(l => l.level === selectedLevel + 1)?.levelName}
                                 <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                               </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Info Footer */}
        <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-500">© 2026 DLDL Wiki</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-slate-500">Hệ Thống Đốt Cốt</span>
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
      `}</style>
    </div>
  );
}
