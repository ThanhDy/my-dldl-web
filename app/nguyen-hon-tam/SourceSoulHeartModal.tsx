"use client";

import React from "react";
import { X, Star, Zap, Shield, Sparkles, User, Info, Hexagon } from "lucide-react";
import { SourceSoulHeart } from "@/data/types";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinary } from "@/lib/utils";
import Image from "next/image";

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
        <span
          key={index}
          className={`font-black ${colorMap[color] || "text-slate-200"}`}
        >
          {label}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export default function SourceSoulHeartModal({
  item,
  onClose,
}: {
  item: SourceSoulHeart;
  onClose: () => void;
}) {
  if (!item) return null;

  const isSP = item.rarity === "SP" || item.rarity === "SP+";
  const isSSR_Plus = item.rarity === "SSR+";
  const rarityColor = isSP ? "from-fuchsia-500 to-indigo-600" : isSSR_Plus ? "from-red-600 to-red-900" : "from-amber-400 to-amber-700";
  const glowClass = isSP ? "shadow-fuchsia-500/20 border-fuchsia-500/50" : isSSR_Plus ? "shadow-red-600/20 border-red-500/50" : "shadow-amber-500/20 border-amber-500/50";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`bg-slate-950/80 rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col ${glowClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 rounded-full transition-all z-20 hover:rotate-90"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="p-10 pb-8 flex items-center gap-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center bg-slate-900 ${glowClass} shadow-2xl`}>
            {item.avatar ? (
              <Image src={optimizeCloudinary(item.avatar, 200) || item.avatar} alt={item.name} fill className="object-cover" />
            ) : (
              <Hexagon className="text-slate-500" size={40} />
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter drop-shadow-2xl">
              {item.name}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                <User size={12} />
                <span>{item.character}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {item.basicStat && (
            <section className="space-y-4">
               <div className="flex items-center gap-2">
                 <Shield size={14} className="text-slate-500" />
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Chỉ số cơ bản</h4>
               </div>
               <div className="text-slate-300 text-sm leading-relaxed bg-white/[0.02] p-6 rounded-3xl border border-white/5 whitespace-pre-wrap font-medium">
                 {formatText(item.basicStat)}
               </div>
            </section>
          )}

          {item.isExtend && (
            <section className="space-y-4">
               <div className="flex items-center gap-2">
                 <Zap size={14} className="text-amber-500" />
                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Thần Vị</h4>
               </div>
               <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10 text-slate-300 text-sm leading-relaxed">
                 Hệ thống cho phép người sở hữu đồng bộ và trang bị <span className="text-amber-400 font-black italic uppercase">Hồn Cốt Thần Vị</span> của nhân vật chủ quản: <span className="text-white font-black italic">{item.character}</span>.
               </div>
            </section>
          )}

          {item.basicSkill && (
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.0"
                    width="14"
                    height="14"
                    viewBox="0 0 55.000000 49.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,49.000000) scale(0.100000,-0.100000)"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 0 h550 v490 h-550 z M0 245 l0 -245 275 0 275 0 0 245 0 245 -135 0 c-83 0 -135 -4 -135 -10 0 -6 9 -19 20 -30 l20 -20 -21 -21 c-14 -14 -18 -27 -13 -42 8 -28 43 -67 69 -77 14 -6 15 -9 4 -9 -20 -1 -65 -49 -74 -81 l-8 -25 -11 27 c-14 33 -45 68 -71 79 -14 5 -15 8 -4 8 19 1 65 49 73 78 5 15 1 28 -13 42 -21 21 -21 21 -1 41 11 11 20 25 20 30 0 6 -52 10 -135 10 l-135 0 0 -245z m418 119 c28 -32 29 -78 1 -123 l-21 -35 24 15 c12 9 33 35 46 59 21 43 22 43 22 14 0 -16 -9 -46 -19 -67 -20 -40 -20 -42 10 -27 10 6 19 7 19 2 0 -19 -51 -54 -96 -66 -43 -11 -52 -18 -77 -62 l-28 -49 4 58 c3 51 2 56 -11 43 -13 -13 -17 -12 -33 7 -17 21 -17 20 -13 -43 l5 -65 -28 49 c-25 44 -34 51 -77 62 -32 8 -61 24 -80 45 -29 30 -27 32 18 13 11 -4 10 3 -5 32 -10 21 -19 52 -19 69 0 30 1 30 19 -11 18 -39 53 -74 75 -74 5 0 0 10 -12 22 -41 45 -37 124 9 148 26 14 75 12 88 -3 8 -11 5 -13 -19 -9 -36 5 -80 -35 -80 -74 0 -26 22 -51 102 -119 l36 -31 34 31 c19 16 46 40 61 52 68 57 28 161 -53 140 -26 -7 -15 12 14 23 29 12 57 3 84 -26z"
                      />
                    </g>
                  </svg>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Kỹ năng cơ bản</h4>
                </div>
               <div className="bg-blue-600/5 p-6 rounded-3xl border border-blue-500/10 text-slate-300 text-sm leading-relaxed space-y-4">
                 <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <span className="text-blue-400 font-black text-xs uppercase tracking-tighter">Nguyên Hồn Tâm</span>
                    <span className="text-white font-black">Lv1</span>
                    <span className="text-slate-600 font-bold">/ 40 / 50 / 60 / 100</span>
                 </div>
                 <p className="whitespace-pre-wrap opacity-90">{formatText(item.basicSkill)}</p>
               </div>
            </section>
          )}

          {item.starEffects && item.starEffects.length > 0 && (
            <section className="space-y-6 pb-6">
              <div className="flex items-center gap-2">
                 <Star size={14} className="text-purple-400" />
                 <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Hồn cốt Hồn Sư</h4>
               </div>
              <div className="grid gap-4">
                {item.starEffects.map((effect, index) => (
                  <div
                    key={index}
                    className="bg-purple-600/5 p-6 rounded-[2rem] border border-purple-500/10 flex gap-6 items-start hover:bg-purple-600/10 transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-4 py-2 rounded-xl bg-slate-900 border border-purple-500/20 shadow-2xl group-hover:scale-110 transition-transform">
                      <div className="flex items-center gap-1 text-purple-400">
                        <span className="text-xl font-black leading-none italic">
                          {effect.star}
                        </span>
                        <Star size={14} fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium leading-relaxed text-slate-200">
                        {effect.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Info size={10} className="text-slate-500" />
                        <span className="text-[12px] font-black uppercase text-slate-500 tracking-widest">
                          Nguyên Hồn Tâm cấp {effect.condition >= 10000 ? effect.condition / 10000 + " vạn" : effect.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
