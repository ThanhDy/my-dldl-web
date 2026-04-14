"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  Zap, 
  Target, 
  Sparkles, 
  Shield, 
  Info,
  ChevronRight,
  Flame,
  Layers,
  Link as LinkIcon,
  ArrowRight,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HungThuSoulRing, HungThuSystem } from "@/data/types";
import BackToTop from "@/app/components/BackToTop";
import Image from "next/image";

const SYSTEMS_UI = ["Cường/Mẫn", "Khống Chế", "Phụ Trợ/Phòng Ngự"] as const;
type HungThuSystemUI = typeof SYSTEMS_UI[number];

const SYSTEM_ICONS: Record<string, any> = {
  "Cường/Mẫn": Zap,
  "Khống Chế": Sparkles,
  "Phụ Trợ/Phòng Ngự": Shield
};

const SYSTEM_COLORS: Record<string, string> = {
  "Cường/Mẫn": "from-orange-500 to-indigo-600",
  "Khống Chế": "from-purple-500 to-pink-600",
  "Phụ Trợ/Phòng Ngự": "from-emerald-500 to-teal-600"
};

interface HungThuSoulRingClientProps {
  initialData: HungThuSoulRing[];
}

export default function HungThuSoulRingClient({ initialData }: HungThuSoulRingClientProps) {
  const [activeSystem, setActiveSystem] = useState<HungThuSystemUI>(SYSTEMS_UI[0]);
  const [activeType, setActiveType] = useState<"All" | "Regular" | "Combined">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchesSystem = activeSystem === "Cường/Mẫn" 
        ? item.systems?.some(s => s === "Cường Công" || s === "Mẫn Công")
        : item.systems?.includes(activeSystem as any);
      const matchesType = activeType === "All" || item.type === activeType;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSystem && matchesType && matchesSearch;
    });
  }, [initialData, activeSystem, activeType, searchQuery]);

  const selectedRing = useMemo(() => {
    return initialData.find(r => r.id === selectedRingId);
  }, [initialData, selectedRingId]);

  // Tự động chọn hồn hoàn đầu tiên khi load hoặc khi đổi bộ lọc
  React.useEffect(() => {
    if (filteredData.length > 0) {
      if (!selectedRingId || !filteredData.find(r => r.id === selectedRingId)) {
        setSelectedRingId(filteredData[0].id);
      }
    } else {
      setSelectedRingId(null);
    }
  }, [filteredData, selectedRingId]);

  // Tìm các hồn hoàn liên quan
  const relatedRings = useMemo(() => {
    if (!selectedRing) return [];
    
    if (selectedRing.type === "Combined") {
      // Tìm 2 hồn hoàn thành phần
      return initialData.filter(r => selectedRing.componentIds?.includes(r.id));
    } else {
      // Tìm hồn hoàn kết hợp cùng HOẶC hồn hoàn kết quả (Combined) từ việc phối hợp
      return initialData.filter(r => 
        r.id === selectedRing.suitableWithId || 
        (r.type === "Combined" && r.componentIds?.includes(selectedRing.id))
      );
    }
  }, [initialData, selectedRing]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-orange-500/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020617_100%)] pointer-events-none" />
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
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] uppercase font-black tracking-wider bg-white/5 px-4 py-2 rounded-xl border border-white/5"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Trang chủ</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
                Hồn Hoàn <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">Hung Thú</span>
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Filters & Nav */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex-1 flex flex-wrap items-center gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md overflow-x-auto scroll-hide">
              {SYSTEMS_UI.map(sys => {
                const Icon = SYSTEM_ICONS[sys];
                const isActive = activeSystem === sys;
                return (
                  <button
                    key={sys}
                    onClick={() => setActiveSystem(sys)}
                    className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all ${
                      isActive ? "bg-white/10 text-white border border-white/10" : "text-slate-500 hover:text-white"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-orange-400" : ""} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{sys}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md">
                <button 
                  onClick={() => setActiveType("Regular")}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeType === "Regular" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:text-white"
                  }`}
                >
                  Loại thường
                </button>
                <button 
                  onClick={() => setActiveType("Combined")}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeType === "Combined" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-slate-500 hover:text-white"
                  }`}
                >
                  Kết hợp
                </button>
                <button 
                  onClick={() => setActiveType("All")}
                   className={`p-2.5 rounded-2xl transition-all ${activeType === "All" ? "text-orange-400" : "text-slate-600 hover:text-slate-400"}`}
                >
                  <RefreshCw size={18} className={activeType === "All" ? "rotate-180" : ""} />
                </button>
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* List Section */}
          <div className="lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
             <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text"
                  placeholder="Tìm hồn hoàn..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-200 outline-none focus:border-orange-500/40 transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="grid grid-cols-1 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      onClick={() => setSelectedRingId(item.id)}
                      className={`
                        p-4 rounded-3xl border cursor-pointer transition-all duration-300 group
                        ${selectedRingId === item.id 
                          ? "bg-orange-500/10 border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]" 
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 ${selectedRingId === item.id ? "ring-2 ring-orange-500/40" : ""}`}>
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-black text-sm capitalize tracking-tighter truncate ${selectedRingId === item.id ? "text-orange-400" : "text-white"}`}>{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {item.systems?.map(s => (
                              <span key={s} className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                                {s}
                              </span>
                            ))}
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              item.type === "Combined" ? "text-purple-400 bg-purple-500/10" : "text-blue-400 bg-blue-500/10"
                            }`}>
                               {item.type === "Combined" ? "Kết hợp" : "Thường"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className={`text-slate-600 transition-all ${selectedRingId === item.id ? "translate-x-0 opacity-100 text-orange-500" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredData.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-wider">Không tìm thấy dữ liệu phù hợp</p>
                  </div>
                )}
             </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedRing ? (
                <motion.div
                  key={selectedRing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-6 md:p-8 relative overflow-hidden group shadow-2xl"
                >
                  {/* Decorative Elements */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                   <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
                   
                   <div className="relative z-10 space-y-8">
                      {/* Ring Header Info */}
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                         <div className="relative w-28 h-28 shrink-0">
                            <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                               <Image src={selectedRing.image} alt={selectedRing.name} fill className="object-cover" unoptimized />
                            </div>
                         </div>
                         <div className="space-y-4">
                             <div className="space-y-1">
                               <h2 className="text-3xl md:text-4xl font-black text-white capitalize tracking-tighter leading-none">
                                 {selectedRing.name}
                               </h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                               {selectedRing.systems?.map(s => (
                                 <div key={s} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                    {SYSTEM_ICONS["Cường/Mẫn"] && (s === "Cường Công" || s === "Mẫn Công") ? (
                                       React.createElement(Zap, { size: 16, className: "text-orange-400" })
                                    ) : (
                                       SYSTEM_ICONS[s] && React.createElement(SYSTEM_ICONS[s], { size: 16, className: "text-orange-400" })
                                    )}
                                    <span className="text-xs font-black uppercase text-slate-300">{s}</span>
                                 </div>
                               ))}
                             </div>
                         </div>
                      </div>

                      {/* Basic Effect */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <span className="text-xs font-black uppercase tracking-wider text-orange-500/60">Hiệu ứng cơ bản</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                         </div>
                         <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 md:p-6 text-sm md:text-base font-medium text-slate-200 leading-relaxed ">
                            "{selectedRing.basicEffect}"
                         </div>
                      </div>

                      {/* Year Milestones */}
                      <div className="grid grid-cols-1 gap-6">
                         {selectedRing.yearEffects.map((eff, index) => (
                           <div key={index} className="bg-slate-900/40 rounded-[2rem] border border-white/5 p-8 space-y-4 hover:border-orange-500/30 transition-all group/card">
                              <div className="flex items-center justify-between">
                                 <h5 className="text-xs font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-4 py-1.5 rounded-full">
                                    {eff.year}
                                 </h5>
                              </div>
                              <p className="text-slate-300 text-base leading-relaxed font-medium">
                                 {eff.effect}
                              </p>
                           </div>
                         ))}
                      </div>

                      {/* Related Rings */}
                      {relatedRings.length > 0 && (
                        <div className="pt-10 border-t border-white/10 space-y-6">
                           <div className="flex items-center gap-3">
                              <LinkIcon size={18} className="text-orange-400" />
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                                {selectedRing.type === "Combined" ? "Được hợp thành từ" : "Có thể kết hợp cùng"}
                              </h4>
                           </div>
                           <div className="flex flex-wrap items-center gap-4">
                               {/* Hiển thị dấu + phía trước khi xem loại Thường để tạo thành công thức */}
                               {selectedRing.type === "Regular" && (
                                 <div className="flex items-center justify-center p-2">
                                   <Plus className="text-slate-600" size={18} />
                                 </div>
                               )}

                               {relatedRings.map((r, index) => (
                                 <React.Fragment key={r.id}>
                                   {/* Mũi tên trước hồn hoàn Kết hợp */}
                                   {selectedRing.type === "Regular" && r.type === "Combined" && (
                                     <div className="flex items-center justify-center p-2">
                                       <ArrowRight className="text-orange-500 animate-pulse" size={20} />
                                     </div>
                                   )}
                                   
                                   <button 
                                     onClick={() => setSelectedRingId(r.id)}
                                     className={`flex items-center gap-4 border rounded-2xl p-4 transition-all group min-w-[200px] ${
                                       r.type === "Combined" 
                                         ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                                         : "bg-white/5 border-white/5 hover:bg-white/10"
                                     }`}
                                   >
                                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                                         <Image src={r.image} alt={r.name} fill className="object-cover" unoptimized />
                                      </div>
                                      <div className="text-left">
                                         <div className={`text-xs font-black uppercase transition-colors ${
                                           r.type === "Combined" ? "text-purple-400 group-hover:text-purple-300" : "text-white group-hover:text-orange-400"
                                         }`}>{r.name}</div>
                                         <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{r.systems?.join(" / ")}</div>
                                      </div>
                                   </button>

                                   {/* Dấu cộng giữa 2 hồn hoàn thành phần nếu đang ở chế độ xem Kết hợp */}
                                   {selectedRing.type === "Combined" && index === 0 && (
                                      <div className="flex items-center justify-center p-2">
                                        <Plus className="text-slate-600" size={18} />
                                      </div>
                                   )}
                                 </React.Fragment>
                               ))}
                            </div>
                        </div>
                      )}
                   </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] opacity-40">
                   <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                      <Info size={40} className="text-slate-700" />
                   </div>
                   <div className="text-center space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Vui lòng chọn một hồn hoàn để xem chi tiết</p>
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
              <span className="text-slate-500">© 2026 DLDL Wiki</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-slate-500">Hồn Hoàn Hung Thú</span>
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

// Helper for Lucide icons
const RefreshCw = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
