"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, PawPrint, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackToTop from "@/app/components/BackToTop";
import { ThanThu } from "@/data/types";
import { optimizeCloudinary } from "@/lib/utils";

interface Props {
  initialData: ThanThu[];
}

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
                <PawPrint className="text-yellow-500" size={56} />
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
              <div className="w-full aspect-square bg-slate-900/50 rounded-3xl border border-white/5 relative overflow-hidden group-hover:border-yellow-500/50 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] transition-all duration-300">
                {item.image ? (
                  <img 
                    src={optimizeCloudinary(item.image, 200) || item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PawPrint size={32} className="text-slate-600 group-hover:text-yellow-500 transition-colors" />
                  </div>
                )}
                {/* Rarity Badge */}
                {item.rarity && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-md border shadow-lg bg-black/60 text-yellow-400 border-yellow-500/30">
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
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-slate-800 overflow-hidden shrink-0 relative z-10">
                    {selectedItem.image ? (
                      <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint size={40} className="text-slate-500 m-auto mt-8 md:mt-12" />
                    )}
                  </div>
                  <div className="relative z-10 pb-1 md:pb-2">
                    {selectedItem.rarity && (
                      <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                        Phẩm Chất: {selectedItem.rarity}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic drop-shadow-lg">
                      {selectedItem.name}
                    </h2>
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
                      {selectedItem.description}
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
                            {effect.effect}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.skills && selectedItem.skills.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <PawPrint size={14} className="text-blue-400" /> Trạng Thái Đặc Biệt
                    </h3>
                    <div className="space-y-3">
                      {selectedItem.skills.map((skill, idx) => (
                        <div key={idx} className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
                          <h4 className="font-black text-blue-400 uppercase tracking-tight text-sm mb-2">{skill.name}</h4>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{skill.description}</p>
                        </div>
                      ))}
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