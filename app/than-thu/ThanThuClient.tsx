"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackToTop from "@/app/components/BackToTop";
import { ThanThu } from "@/data/types";
import { optimizeCloudinary } from "@/lib/utils";
import { formatText } from "@/app/components/FormattedText";
import { ThanThuIcon } from "@/app/components/Icons";

interface Props {
  initialData: ThanThu[];
}

const getRarityBadgeStyles = (rarity: string | undefined) => {
  const r = rarity?.toUpperCase().trim() || "";
  if (r === "R") {
    return "bg-black/60 text-blue-400 border-blue-500/30";
  }
  if (r === "SR") {
    return "bg-black/60 text-purple-400 border-purple-500/30";
  }
  if (r === "SSR") {
    return "bg-black/60 text-yellow-400 border-yellow-500/30";
  }
  if (r === "SSR+") {
    return "bg-black/60 text-red-400 border-red-500/30";
  }
  if (r.startsWith("SP")) {
    return "bg-gradient-to-r from-pink-600/30 via-white/10 to-cyan-500/30 text-white border-cyan-400/40 shadow-[0_0_8px_rgba(236,72,153,0.3)]";
  }
  return "bg-black/60 text-slate-400 border-slate-500/30";
};

const getCardHoverStyles = (rarity: string | undefined) => {
  const r = rarity?.toUpperCase().trim() || "";
  if (r === "R") {
    return "group-hover:border-blue-500/50 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]";
  }
  if (r === "SR") {
    return "group-hover:border-purple-500/50 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]";
  }
  if (r === "SSR") {
    return "group-hover:border-yellow-500/50 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.25)]";
  }
  if (r === "SSR+") {
    return "group-hover:border-red-500/50 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]";
  }
  if (r.startsWith("SP")) {
    return "group-hover:border-pink-500/60 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]";
  }
  return "group-hover:border-yellow-500/50 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.25)]";
};

const getModalRarityStyles = (rarity: string | undefined) => {
  const r = rarity?.toUpperCase().trim() || "";
  if (r === "R") {
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  }
  if (r === "SR") {
    return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  }
  if (r === "SSR") {
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }
  if (r === "SSR+") {
    return "bg-red-500/20 text-red-400 border-red-500/30";
  }
  if (r.startsWith("SP")) {
    return "bg-gradient-to-r from-pink-600/30 via-white/10 to-cyan-500/30 text-white border-cyan-400/40 shadow-[0_0_10px_rgba(236,72,153,0.25)]";
  }
  return "bg-slate-500/20 text-slate-400 border-slate-500/30";
};

const getModalAvatarStyles = (rarity: string | undefined) => {
  const r = rarity?.toUpperCase().trim() || "";
  if (r === "R") {
    return "border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]";
  }
  if (r === "SR") {
    return "border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]";
  }
  if (r === "SSR") {
    return "border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]";
  }
  if (r === "SSR+") {
    return "border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]";
  }
  if (r.startsWith("SP")) {
    return "border-pink-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]";
  }
  return "border-slate-500/30 shadow-[0_0_30px_rgba(100,116,139,0.2)]";
};

export default function ThanThuClient({ initialData }: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ThanThu | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-yellow-500/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#422006_0%,#020617_100%)] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
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
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl italic flex items-center gap-4">
                <ThanThuIcon className="text-yellow-500" size={56} />
                <span>Thần <span className="text-yellow-500">Thú</span></span>
              </h1>
              <p className="text-slate-400 mt-4 max-w-2xl text-sm md:text-base font-medium">
                Tra cứu thông tin, kỹ năng và hiệu ứng cấp độ của Thần Thú.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Grid List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6"
        >
          {initialData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer flex flex-col items-center gap-3"
            >
              <div className={`w-full aspect-square bg-slate-900/50 rounded-3xl border border-white/5 relative overflow-hidden transition-all duration-300 ${item.rarity ? getCardHoverStyles(item.rarity) : "group-hover:border-yellow-500/50 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.25)]"}`}>
                {item.image ? (
                  <img 
                    src={optimizeCloudinary(item.image, 200) || item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ThanThuIcon size={32} className="text-slate-600 group-hover:text-yellow-500 transition-colors" />
                  </div>
                )}
                {/* Rarity Badge */}
                {item.rarity && (
                  <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-md border shadow-lg ${getRarityBadgeStyles(item.rarity)}`}>
                    {item.rarity}
                  </div>
                )}
              </div>
              <h3 className="text-[11px] md:text-xs font-black uppercase tracking-wider text-slate-300 group-hover:text-yellow-400 text-center px-1 truncate w-full transition-colors">
                {item.name}
              </h3>
            </motion.div>
          ))}
          {initialData.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 text-sm font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-3xl">
              Chưa có dữ liệu Thần Thú.
            </div>
          )}
        </motion.div>
      </div>

      <BackToTop />

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-[5%] md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[95%] md:w-[90%] max-w-2xl bg-slate-900 border border-white/10 rounded-3xl z-[101] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header Modal */}
              <div className="relative h-48 md:h-56 shrink-0 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  {selectedItem.image ? (
                    <img src={selectedItem.image} alt="bg" className="w-full h-full object-cover blur-xl scale-125" />
                  ) : (
                    <div className="w-full h-full bg-slate-800" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white z-10 backdrop-blur-md">
                  <X size={20} />
                </button>

                 <div className="absolute bottom-0 left-0 w-full p-6 flex items-end gap-5">
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl border bg-slate-800 overflow-hidden shrink-0 relative z-10 ${getModalAvatarStyles(selectedItem.rarity)}`}>
                    {selectedItem.image ? (
                      <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <ThanThuIcon size={40} className="text-slate-500 m-auto mt-8 md:mt-12" />
                    )}
                  </div>
                  <div className="relative z-10 pb-1 md:pb-2">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic drop-shadow-lg">
                      {selectedItem.name}
                    </h2>
                    {selectedItem.rarity && (
                      <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-widest mb-2 inline-block ${getModalRarityStyles(selectedItem.rarity)}`}>
                        {selectedItem.rarity}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Modal */}
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 bg-slate-900">
                
                {selectedItem.description && (
                  <div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" /> Mô Tả Cơ Bản
                    </h3>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {formatText(selectedItem.description)}
                    </div>
                  </div>
                )}

                {selectedItem.levelEffects && selectedItem.levelEffects.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Star size={14} className="text-orange-400" /> Hiệu Ứng Nâng Cấp
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.levelEffects.map((effect, idx) => (
                        <div key={idx} className="flex gap-4 items-start bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4">
                          <div className="shrink-0 bg-orange-500/20 text-orange-400 px-2.5 py-1.5 rounded text-xs font-black uppercase border border-orange-500/20">
                            Lv.{effect.level}
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pt-0.5">
                            {formatText(effect.effect)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trạng thái / Kỹ năng cơ bản */}
                {selectedItem.skills && selectedItem.skills.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ThanThuIcon size={14} className="text-blue-400" /> Trạng Thái Đặc Biệt
                    </h3>
                    <div className="space-y-3">
                      {selectedItem.skills.map((skill, idx) => (
                        <div key={idx} className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
                          <h4 className="font-black text-blue-400 uppercase tracking-tight text-sm mb-2">{skill.name}</h4>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{formatText(skill.description)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kỹ năng liên minh (chỉ dành cho SP+) */}
                {selectedItem.rarity === "SP+" && selectedItem.unionSkills && selectedItem.unionSkills.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ThanThuIcon size={14} className="text-pink-400" /> Kỹ Năng Liên Minh
                    </h3>
                    <div className="space-y-4">
                      {selectedItem.unionSkills.map((skill, idx) => {
                        const linkedThanThu = initialData.find(t => t.id === skill.linkedThanThuId);
                        return (
                          <div key={idx} className="bg-pink-500/5 border border-pink-500/10 rounded-2xl p-4 space-y-4">
                            <div className="flex items-center gap-3 border-b border-pink-500/10 pb-3">
                              {/* Avatar thần thú liên kết */}
                              <div className="w-10 h-10 rounded-full bg-slate-800 border border-pink-500/20 overflow-hidden shrink-0 relative">
                                {linkedThanThu?.image ? (
                                  <img src={linkedThanThu.image} alt={linkedThanThu.name} className="w-full h-full object-cover" />
                                ) : (
                                  <ThanThuIcon size={18} className="text-slate-500 m-auto mt-2" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-black text-pink-400 uppercase tracking-tight text-sm leading-tight">
                                  {skill.name}
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                  Kỹ năng này được mở khóa sau khi liên minh với: <span className="text-white">{linkedThanThu?.name || "Chưa xác định"}</span>
                                </p>
                              </div>
                            </div>

                            {/* Các mốc Level */}
                            {skill.levelEffects && skill.levelEffects.length > 0 && (
                              <div className="space-y-3 pl-2">
                                {skill.levelEffects.map((eff, effIdx) => (
                                  <div key={effIdx} className="flex gap-3 items-start">
                                    <div className="shrink-0 bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-pink-500/20">
                                      Lv.{eff.level}
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                      {formatText(eff.effect)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}