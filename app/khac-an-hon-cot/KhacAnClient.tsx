"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Crosshair, Wrench, Sword, Shield, Sparkles, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackToTop from "@/app/components/BackToTop";
import { KhacAnSystem, KhacAnSet, KhacAnPiece } from "@/data/types";
import { optimizeCloudinary } from "@/lib/utils";

const TABS = [
  { id: "cuong-man", label: "Cường Công - Mẫn Công", icon: Sword },
  { id: "ho-tro", label: "Hỗ Trợ - Phòng Ngự", icon: Shield },
  { id: "khong-che", label: "Khống Chế", icon: Sparkles },
  { id: "sp", label: "Khắc Ấn SP", icon: Star }
];

interface Props {
  initialData: KhacAnSystem[];
}

export default function KhacAnClient({ initialData }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [selectedPiece, setSelectedPiece] = useState<{
    setNum: number;
    pieceId: string;
    pieceData: KhacAnPiece;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"PVP" | "PVE">("PVP");

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentSystemData = initialData.find(s => s.id === activeTab);

  const getSetData = (setId: number) => {
    return currentSystemData?.sets?.find((s: KhacAnSet) => s.setId === setId) || null;
  };

  const getPieceData = (setData: KhacAnSet | null, pieceId: string) => {
    const piece = setData?.pieces?.find((p: KhacAnPiece) => p.id === pieceId);
    if (piece) return piece;
    
    // Fallback default
    const isMain = pieceId === 'main';
    return {
      id: pieceId,
      name: isMain ? "Viên Chủ" : `Viên Phụ ${pieceId.replace('sub', '')}`,
      image: "",
      descriptionPVP: "",
      descriptionPVE: ""
    } as KhacAnPiece;
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#064e3b_0%,#020617_100%)] pointer-events-none opacity-50" />
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
                <Crosshair className="text-emerald-500" size={56} />
                <span>Khắc Ấn <span className="text-emerald-500">Hồn Cốt</span></span>
              </h1>
              <p className="text-slate-400 mt-4 max-w-2xl text-sm md:text-base font-medium">
                Hệ thống khắc ấn hồn cốt hồn sư.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md mb-10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 group
                  ${isActive 
                    ? "text-white" 
                    : "text-slate-500 hover:text-slate-300"
                  }
                `}
              >
                {isActive && (
                  <motion.span 
                    layoutId="active-tab-bg-khac-an"
                    className="absolute inset-0 rounded-2xl border bg-emerald-500/10 border-emerald-500/20"
                  />
                )}
                <Icon size={18} className={`relative z-10 transition-colors ${isActive ? "text-emerald-400" : ""}`} />
                <span className="relative z-10 text-xs font-black uppercase tracking-tighter italic">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full relative"
          >
            {activeTab === "sp" ? (
              <div className="space-y-8 relative z-10 w-full">
                <div className="text-center w-full px-4">
                  <p className="text-xs md:text-sm font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    Khắc Ấn SP dành cho cả Cường Công - Mẫn Công - Hỗ Trợ - Phòng Ngự - Khống Chế
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {currentSystemData?.sets?.[0]?.pieces.map(piece => {
                    const hasImage = !!piece.image;
                    return (
                      <div 
                        key={piece.id}
                        onClick={() => setSelectedPiece({ setNum: 1, pieceId: piece.id, pieceData: piece })}
                        className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-xl hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group relative overflow-hidden"
                      >
                        <div className="absolute -bottom-8 -right-8 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-500 text-purple-500">
                          <Star size={100} />
                        </div>
                        
                        <div className={`w-20 h-20 rounded-2xl rotate-45 flex items-center justify-center group-hover:scale-110 transition-all duration-300 overflow-hidden relative mb-6 mt-4 p-[2px] ${hasImage ? 'bg-gradient-to-tr from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]' : 'bg-slate-700 group-hover:bg-slate-600'}`}>
                           <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center overflow-hidden relative">
                             <div className="-rotate-45 w-full h-full absolute inset-0 flex items-center justify-center scale-[1.35]">
                               {hasImage ? (
                                 <img src={optimizeCloudinary(piece.image, 150) || piece.image} alt={piece.name} className="w-full h-full object-cover" />
                               ) : (
                                 <Star size={24} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                               )}
                             </div>
                           </div>
                        </div>
                        <h3 className="font-black text-sm text-white uppercase tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:via-yellow-400 group-hover:to-purple-500 transition-all relative z-10">
                          {piece.name || "Khắc Ấn SP"}
                        </h3>
                      </div>
                    );
                  })}
                  {(!currentSystemData?.sets?.[0]?.pieces || currentSystemData.sets[0].pieces.length === 0) && (
                    <div className="col-span-full py-20 text-center text-slate-500 text-sm font-bold uppercase tracking-widest">
                      Đang cập nhật dữ liệu Khắc Ấn SP...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
              {[1, 2, 3, 4].map((num) => {
                const setData = getSetData(num);
                const setName = setData?.name || `Bộ Khắc Ấn ${num}`;
                
                return (
                  <div 
                    key={num} 
                    className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center space-y-4 shadow-xl hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute -bottom-10 -right-10 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-500 text-emerald-500">
                      <Crosshair size={140} />
                    </div>
                    
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-500 mb-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                      <span className="text-2xl font-black italic">{num}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">
                      {setName}
                    </h3>

                    {/* Cấu trúc 6 Thành phần Khắc Ấn */}
                    <div className="w-full bg-black/20 rounded-2xl p-5 flex flex-col items-center gap-4 border border-white/5 relative z-10 my-2">
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                        
                        {/* Viên Chủ */}
                        {(() => {
                          const mainPiece = getPieceData(setData, 'main');
                          const displayName = mainPiece.name || "Viên Chủ";
                          const hasImage = !!mainPiece.image;
                          
                          return (
                            <div 
                              className="relative group/main cursor-pointer" 
                              title={displayName}
                              onClick={() => setSelectedPiece({ setNum: num, pieceId: 'main', pieceData: mainPiece })}
                            >
                              <div className={`w-10 h-10 border-2 rounded-lg rotate-45 flex items-center justify-center hover:scale-110 transition-all duration-300 overflow-hidden relative ${hasImage ? 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:bg-yellow-500/30' : 'bg-emerald-500/20 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-500/30'}`}>
                                <div className="-rotate-45 w-full h-full absolute inset-0 flex items-center justify-center scale-[1.35]">
                                  {hasImage ? (
                                    <img src={optimizeCloudinary(mainPiece.image, 100) || mainPiece.image} alt={displayName} className="w-full h-full object-cover" />
                                  ) : (
                                    <Sparkles size={14} className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />

                        {/* 5 Viên Phụ */}
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                          {[1, 2, 3, 4, 5].map((sub) => {
                            const subPiece = getPieceData(setData, `sub${sub}`);
                            const pieceName = subPiece.name || `Viên Phụ ${sub}`;
                            const hasImage = !!subPiece.image;
                            return (
                              <div 
                                key={sub} 
                                title={pieceName} 
                                onClick={() => setSelectedPiece({ setNum: num, pieceId: `sub${sub}`, pieceData: subPiece })}
                                className={`w-8 h-8 rounded-lg rotate-45 flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer group/sub overflow-hidden relative ${hasImage ? 'border border-yellow-400/80 bg-yellow-500/10 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:border-yellow-400 hover:bg-yellow-500/30' : 'border border-white/10 bg-white/[0.02] hover:border-emerald-500/50 hover:bg-emerald-500/10'}`}
                              >
                                <div className="-rotate-45 w-full h-full absolute inset-0 flex items-center justify-center scale-[1.35]">
                                  {hasImage ? (
                                    <img src={optimizeCloudinary(subPiece.image, 100) || subPiece.image} alt={pieceName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[11px] font-black text-slate-500 group-hover/sub:text-emerald-400 transition-colors">
                                      {sub}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Info */}
        <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-500">© DLDL Wiki</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-slate-500">Khắc Ấn Hồn Cốt</span>
           </div>
        </div>
      </div>

      <BackToTop />

      {/* Modal Mô Tả Chi Tiết */}
      <AnimatePresence>
        {selectedPiece && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPiece(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 z-[101] shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 opacity-5 text-emerald-500 transform rotate-12 pointer-events-none">
                <Crosshair size={150} />
              </div>
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  {activeTab === 'sp' ? (
                    <div className={`w-14 h-14 rounded-xl rotate-45 flex items-center justify-center overflow-hidden relative p-[2px] ${selectedPiece.pieceData.image ? 'bg-gradient-to-tr from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'bg-slate-700'}`}>
                      <div className="w-full h-full rounded-[10px] bg-[#020617] flex items-center justify-center overflow-hidden relative">
                        <div className="-rotate-45 absolute inset-0 w-full h-full flex items-center justify-center scale-[1.35]">
                          {selectedPiece.pieceData.image ? (
                            <img src={optimizeCloudinary(selectedPiece.pieceData.image, 150) || selectedPiece.pieceData.image} alt={selectedPiece.pieceData.name} className="w-full h-full object-cover" />
                          ) : (
                            <Star size={20} className="text-purple-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-14 h-14 rounded-xl rotate-45 flex items-center justify-center overflow-hidden relative ${
                      selectedPiece.pieceData.image 
                        ? 'bg-yellow-500/20 border-2 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]' 
                        : selectedPiece.pieceId === 'main'
                          ? 'bg-emerald-500/20 border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : 'bg-white/5 border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    }`}>
                      <div className="-rotate-45 absolute inset-0 w-full h-full flex items-center justify-center scale-[1.35]">
                        {selectedPiece.pieceData.image ? (
                           <img src={optimizeCloudinary(selectedPiece.pieceData.image, 150) || selectedPiece.pieceData.image} alt={selectedPiece.pieceData.name} className="w-full h-full object-cover" />
                        ) : selectedPiece.pieceId === 'main' ? (
                          <Sparkles size={20} className="text-emerald-400" />
                        ) : (
                          <span className="text-xl font-black text-emerald-400">
                            {selectedPiece.pieceId.replace('sub', '')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className={`text-xl font-black uppercase tracking-tighter italic ${activeTab === 'sp' ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400' : selectedPiece.pieceData.image ? 'text-yellow-400' : 'text-white'}`}>
                      {selectedPiece.pieceData.name || (activeTab === 'sp' ? "Khắc Ấn SP" : (selectedPiece.pieceId === 'main' ? "Viên Chủ" : `Viên Phụ ${selectedPiece.pieceId.replace('sub', '')}`))}
                    </h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === 'sp' ? 'text-purple-400' : 'text-emerald-500'}`}>
                      {activeTab === 'sp' ? "Khắc Ấn Đặc Biệt" : (getSetData(selectedPiece.setNum)?.name || `Bộ Khắc Ấn ${selectedPiece.setNum}`)}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedPiece(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-black/40 rounded-2xl p-5 border border-white/5 space-y-4 relative z-10">
                <div className="flex bg-slate-950 rounded-xl p-1 border border-white/5">
                  <button onClick={() => setViewMode("PVP")} className={`flex-1 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "PVP" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>PVP</button>
                  <button onClick={() => setViewMode("PVE")} className={`flex-1 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "PVE" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>PVE</button>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mô tả chi tiết ({viewMode})</h4>
                  <div className="text-sm text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 min-h-[80px] whitespace-pre-wrap">
                    {(viewMode === "PVP" ? selectedPiece.pieceData.descriptionPVP : selectedPiece.pieceData.descriptionPVE) || `Dữ liệu chi tiết ${viewMode} đang trong quá trình cập nhật.`}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}