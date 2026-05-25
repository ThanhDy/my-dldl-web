"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  X, 
  Dna, 
  Star, 
  Zap, 
  Info, 
  ArrowUp, 
  ChevronRight,
  Sparkles,
  Hexagon,
  Shield,
  Gamepad2,
  Sword,
  LayoutGrid,
  Bone,
  Crown,
  Waves,
  ZapOff
} from "lucide-react";
import { SkillDetail, SoulBone, NvvCard, NvvCardType } from "@/data/types";
import BackToTop from "@/app/components/BackToTop";
import { optimizeCloudinary } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const YEAR_LABELS: Record<string, string> = {
  y1k: "1k Năm",
  y10k: "10k Năm",
  y25k: "25k Năm",
  y50k: "50k Năm",
  y100k: "100k Năm",
};

const YEAR_ORDER = ["y1k", "y10k", "y25k", "y50k", "y100k"];

import { formatText } from "@/app/components/FormattedText";
// --- THIÊN PHÚ (DÀNH RIÊNG CHO TRẦN TÂM) ---
interface TalentNode {
  x: number;
  y: number;
  l: string;
  special?: boolean;
}

const RED_BRANCH: TalentNode[] = [
  { x: 8, y: 20, l: "0/19" },
  { x: 15, y: 10, l: "0/4" },
  { x: 25, y: 25, l: "0/4" },
  { x: 35, y: 12, l: "0/4" },
  { x: 45, y: 28, l: "0/4" },
  { x: 55, y: 15, l: "0/4" },
  { x: 65, y: 30, l: "0/4" },
  { x: 78, y: 25, l: "0/4" },
  { x: 92, y: 50, l: "0/4", special: true },
];

const YELLOW_BRANCH: TalentNode[] = [
  { x: 8, y: 50, l: "0/15" },
  { x: 18, y: 40, l: "0/4" },
  { x: 28, y: 55, l: "0/4" },
  { x: 38, y: 45, l: "0/4" },
  { x: 48, y: 60, l: "0/4" },
  { x: 58, y: 50, l: "0/4" },
  { x: 68, y: 65, l: "0/4" },
  { x: 78, y: 75, l: "0/4" },
  { x: 92, y: 50, l: "0/4", special: true },
];

const BLUE_BRANCH: TalentNode[] = [
  { x: 8, y: 85, l: "0/11" },
  { x: 20, y: 75, l: "0/9" },
  { x: 32, y: 90, l: "0/4" },
  { x: 44, y: 80, l: "0/4" },
  { x: 56, y: 92, l: "0/4" },
];

const TabButton = ({ 
  active, 
  onClick, 
  icon, 
  label, 
  color 
}: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  label: string,
  color: 'blue' | 'rose' | 'amber' | 'cyan' | 'pink' | 'gold'
}) => {
  const activeStyles = {
    blue: "text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-500/5",
    rose: "text-rose-400 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] bg-rose-500/5",
    amber: "text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-500/5",
    cyan: "text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-500/5",
    pink: "text-pink-400 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] bg-pink-500/5",
    gold: "text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-yellow-500/5",
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-3 whitespace-nowrap ${active ? activeStyles[color] : "text-slate-500 border-white/5 bg-white/[0.02] hover:border-white/20 hover:text-slate-300"}`}
    >
      <span className={active ? "" : "opacity-50"}>{icon}</span>
      {label}
    </button>
  );
};

const renderStarBadge = (count: number, colorClass: string) => (
  <span className={`inline-flex items-center gap-0.5 mx-1 ${colorClass}`}>
    <span className="text-xl font-extrabold leading-none">{count}</span>
    <Star size={14} className="mb-0.5" />
  </span>
);

// --- SKILL MODAL ---
function SkillModal({
  skill,
  onClose,
}: {
  skill: SkillDetail | null;
  onClose: () => void;
}) {
  if (!skill) return null;

  const isSpider = skill.soulRingType.includes("Ma Nhện") || skill.soulRingType.includes("Giáp Thuẫn");
  const themeColor = isSpider ? "rose" : "emerald";
  const glowClass = isSpider ? "shadow-rose-500/20 border-rose-500/50" : "shadow-emerald-500/20 border-emerald-500/50";

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
        className={`bg-slate-950/80 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col ${glowClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 rounded-full transition-all z-20 hover:rotate-90"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="p-8 pb-6 flex items-center gap-6 border-b border-white/5">
          <div className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center bg-slate-900 ${glowClass}`}>
            {skill.iconUrl ? (
              <Image src={optimizeCloudinary(skill.iconUrl, 160) || skill.iconUrl} alt={skill.name} fill className="object-cover" />
            ) : (
              <Zap className={isSpider ? "text-rose-400" : "text-emerald-400"} size={32} />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{skill.name}</h3>
            <div className="flex gap-2">
              <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {skill.type}
              </span>
              <span className={`${isSpider ? "bg-rose-600/10 text-rose-400 border-rose-500/20" : "bg-emerald-600/10 text-emerald-400 border-emerald-500/20"} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border`}>
                {skill.soulRingType}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 size={14} className="text-slate-500" />
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Hệ thống kỹ năng</h4>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed bg-white/[0.02] p-6 rounded-3xl border border-white/5 whitespace-pre-wrap">
              {formatText(skill.description)}
            </div>
          </section>

          {skill.yearEffects && Object.keys(skill.yearEffects).length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-blue-400" />
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Hiệu ứng niên hạn</h4>
              </div>
              <div className="space-y-3">
                {YEAR_ORDER.map((key) => {
                  const effects = skill.yearEffects as any;
                  const desc = effects[key];
                  if (!desc) return null;
                  return (
                    <div key={key} className="flex gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <span className="font-black text-blue-500/80 text-[10px] uppercase tracking-widest min-w-[80px] pt-1 group-hover:text-blue-400 transition-colors">
                        {YEAR_LABELS[key]}
                      </span>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{formatText(desc)}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {skill.note && skill.note.length > 0 && (
            <section className="space-y-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Info size={14} className="text-amber-400" />
                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Giải thích chi tiết</h4>
              </div>
              <div className="space-y-4">
                {skill.note.map((line, index) => {
                  const content = line.trim();
                  if (!content) return null;
                  return (
                    <div key={index} className="bg-amber-500/[0.03] border border-amber-500/10 p-5 rounded-3xl text-sm hover:border-amber-500/30 transition-colors">
                      {content.includes(":") ? (
                        <>
                          <div className="mb-2 text-amber-400 font-black uppercase tracking-tighter text-base">
                            {content.split(":")[0].trim()}
                          </div>
                          <div className="text-slate-400 leading-relaxed pt-2 border-t border-white/5 whitespace-pre-wrap">
                            {formatText(content.split(":").slice(1).join(":").trim())}
                          </div>
                        </>
                      ) : (
                        <p className="italic text-amber-400/80 whitespace-pre-wrap">{formatText(content)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SeventhSkillModal({
  skill,
  onClose,
}: {
  skill: {
    name: string;
    description: string;
    label: string;
    color: string;
    bg: string;
    iconUrl?: string;
  } | null;
  onClose: () => void;
}) {
  if (!skill) return null;

  const color = skill.color;
  const isRedOrRose = color.includes("rose") || color.includes("red");
  const glowClass = isRedOrRose ? "shadow-rose-500/20 border-rose-500/50" : "shadow-yellow-500/20 border-yellow-500/50";

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
        className={`bg-slate-950/80 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col ${glowClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 rounded-full transition-all z-20 hover:rotate-90"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="p-8 pb-6 flex items-center gap-6 border-b border-white/5">
          <div className={`relative w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center bg-slate-900 ${glowClass}`}>
            {skill.iconUrl ? (
              <Image src={optimizeCloudinary(skill.iconUrl, 160) || skill.iconUrl} alt={skill.name} fill className="object-cover" />
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-950 font-black italic`}>
                <span className={`text-xl ${color}`}>{skill.label.split(" ")[0]}</span>
                <span className="text-[8px] uppercase tracking-tighter text-slate-500 font-bold -mt-0.5">Vạn Năm</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{skill.name}</h3>
            <div className="flex gap-2">
              <span className="bg-rose-600/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">
                Đệ Thất Hồn Kỹ
              </span>
              <span className={`${skill.bg} ${skill.color} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-current`}>
                {skill.label}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-rose-400" />
              <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Hiệu ứng kỹ năng</h4>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed bg-white/[0.02] p-6 rounded-3xl border border-white/5 whitespace-pre-wrap">
              {formatText(skill.description)}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SoulBoneModal({
  bone,
  onClose,
}: {
  bone: SoulBone | null;
  onClose: () => void;
}) {
  if (!bone) return null;

  const isMutated = !!bone.mutation?.name;
  const isUpgraded = !!bone.upgrade?.name;
  const themeColor = isMutated ? "rose" : "amber";
  const glowClass = isMutated ? "shadow-rose-500/20 border-rose-500/50" : "shadow-amber-500/20 border-amber-500/50";

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
        className={`bg-slate-950/80 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col ${glowClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 rounded-full transition-all z-20 hover:rotate-90"
        >
          <X size={20} />
        </button>

        <div className="pt-12 pb-8 px-8 flex flex-col items-center bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={12} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
              Hồn Cốt {bone.position}
            </span>
          </div>
          
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl mb-6 border-2 relative overflow-hidden bg-slate-900 ${glowClass}`}>
            {bone.iconUrl ? (
              <Image src={optimizeCloudinary(bone.iconUrl, 200) || bone.iconUrl} alt="" fill className="object-cover" />
            ) : (
              <Hexagon className={isMutated ? "text-rose-400" : "text-amber-400"} size={40} />
            )}
          </div>
          
          <h2 className={`text-3xl font-black italic uppercase tracking-tighter text-center italic ${isMutated ? "text-rose-400" : "text-amber-400"}`}>
            {bone.name}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-amber-500/80 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
              <Sword size={12} /> Hiệu quả cơ bản
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {formatText(bone.standard?.base)}
            </p>
            {(bone.standard?.star4 || bone.standard?.star6) && (
              <div className="pt-4 border-t border-white/5 space-y-3">
                {bone.standard?.star4 && (
                  <div className="flex gap-3">
                    <span className="text-amber-400 font-black text-xs min-w-[30px]">4★</span>
                    <span className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{formatText(bone.standard.star4)}</span>
                  </div>
                )}
                {bone.standard?.star6 && (
                  <div className="flex gap-3">
                    <span className="text-amber-500 font-black text-xs min-w-[30px]">6★</span>
                    <span className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{formatText(bone.standard.star6)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {isMutated && bone.mutation && (
            <div className="bg-rose-500/[0.03] p-6 rounded-3xl border border-rose-500/10 space-y-4">
              <h3 className="text-rose-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                <Dna size={14} /> Hiệu quả Suy Biến
              </h3>
              <p className="text-rose-400 text-base font-black italic uppercase tracking-tight">
                {bone.mutation.name}
              </p>
              <div className="space-y-3 pt-2">
                {[1, 4, 5, 6].map((star) => {
                  const key = `star${star}${star === 1 ? "Red" : "Red"}` as any; 
                  // Note: star1Red, star4Red, etc. based on the previous code.
                  const desc = (bone.mutation as any)[`star${star}Red`];
                  if (!desc) return null;
                  return (
                    <div key={star} className="flex gap-3">
                      <span className="text-rose-500 font-black text-xs min-w-[30px]">{star}★</span>
                      <span className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{formatText(desc)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isUpgraded && bone.upgrade && (
            <div className="bg-blue-500/[0.03] p-6 rounded-3xl border border-blue-500/10 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <ArrowUp size={14} className="text-blue-400" />
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Hiệu Quả Nâng Cấp
                </h3>
              </div>
              <div className="space-y-4">
                {[2, 3, 5].map((star) => {
                   const desc = (bone.upgrade as any)[`star${star}`];
                   if (!desc) return null;
                   return (
                    <div key={star} className="space-y-2">
                       <span className="text-blue-400 font-black text-xs flex items-center gap-2">
                         <Star size={10} /> {star}★ Upgrade
                       </span>
                       <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 whitespace-pre-wrap">{formatText(desc)}</p>
                    </div>
                   );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


// --- NVV CARD MODAL ---
const NvvCardModal = ({
  card,
  onClose,
}: {
  card: NvvCard;
  onClose: () => void;
}) => {
  if (!card) return null;
  const isQuestCard = !!card.detailedEffect.quest;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-950/90 border border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 bg-white/5 p-2 rounded-full text-slate-400 hover:text-white transition-all hover:rotate-90"
        >
          <X size={20} />
        </button>

        {/* Left Side: Card Visual */}
        <div className="w-full md:w-[45%] shrink-0 relative bg-slate-900/50 p-8 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#db277710_0%,transparent_100%)] pointer-events-none" />
           
           <div className="w-full max-w-[200px] md:max-w-[280px] relative aspect-[3/4] group">
            {/* Image Container with clipped edges */}
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden border-2 border-pink-500/50 shadow-[0_0_40px_rgba(219,39,119,0.15)] bg-slate-900">
              <Image
                src={optimizeCloudinary(card.image, 600) || card.image}
                alt={card.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="280px"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20 flex items-end justify-center">
                <p className="text-slate-300 text-[11px] italic text-center line-clamp-3 leading-relaxed opacity-90 font-medium">
                  {card.shortDescription}
                </p>
              </div>
            </div>

            {/* Badges overlapping the borders */}
            <div className="absolute -top-4 inset-x-0 px-6 flex justify-center z-30">
               <h3 className="text-xs font-black text-white text-center bg-slate-950 border-2 border-pink-500/50 px-6 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(219,39,119,0.3)] uppercase tracking-tight leading-snug">
                {card.name}
              </h3>
            </div>

            <div className="absolute top-[40%] -right-3.5 -translate-y-1/2 z-30">
               <div className="bg-pink-600 text-white text-[8px] py-4 px-1.5 rounded-full flex flex-col items-center justify-center gap-0.5 font-black uppercase tracking-tighter border-2 border-pink-400 shadow-2xl min-w-[24px]">
                 {(card.type === "Thông Dụng" ? "Thông Dụng" : "Chuyên Thuộc").split("").map((char: string, i: number) => (
                    <span key={i} className={char === " " ? "h-2" : "leading-none"}>
                      {char}
                    </span>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-[55%] overflow-y-auto p-10 space-y-8 custom-scrollbar bg-slate-950/50">
          <section className="space-y-4">
             <div className="flex items-center gap-2">
               <Zap size={14} className="text-pink-400" />
               <h4 className="text-pink-400 font-black text-[10px] uppercase tracking-[0.3em]">Kỹ năng cơ bản</h4>
             </div>
             <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                <p className="text-slate-300 text-sm leading-relaxed font-medium ">
                  {card.basicSkill}
                </p>
             </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
               <Info size={14} className="text-blue-400" />
               <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">Chi tiết hiệu ứng</h4>
             </div>

            <div className="bg-blue-600/5 p-6 rounded-[2rem] border border-blue-500/10 hover:border-blue-500/30 transition-all group">
            {isQuestCard ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] text-blue-500/50 uppercase font-black tracking-widest">
                    Nhiệm vụ thử luyện
                  </p>
                  <p className="text-blue-100/90 text-sm leading-relaxed font-medium pl-4 border-l-2 border-blue-500/30 ">
                    {card.detailedEffect.quest?.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-blue-500/50 uppercase font-black tracking-widest">
                    Phần thưởng thử luyện
                  </p>
                  <p className="text-blue-100/90 text-sm leading-relaxed font-medium  pl-4 border-l-2 border-blue-500/30">
                    {card.detailedEffect.quest?.buff}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 ">
                   {card.detailedEffect.condition}
                </div>
                <div className="space-y-2">
                  <p className="text-blue-100/90 text-sm leading-relaxed font-medium  pl-4 border-l-2 border-blue-500/30">
                    {card.detailedEffect.effect}
                  </p>
                </div>
              </div>
            )}
            </div>
          </section>

          {card.upgradeEffects && card.upgradeEffects.length > 0 && (
            <section className="space-y-4">
               <div className="flex items-center gap-2">
                 <Sparkles size={14} className="text-purple-400" />
                 <h4 className="text-purple-400 font-black text-[10px] uppercase tracking-[0.3em]">Hiệu ứng tiến hoá</h4>
               </div>
               <div className="grid gap-4">
                {card.upgradeEffects.map((upgrade, idx) => (
                  <div key={idx} className="bg-purple-600/5 p-6 rounded-[2rem] border border-purple-500/10 hover:border-purple-500/30 transition-all space-y-3">
                    <div className="inline-block px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 italic">
                      {upgrade.condition}
                    </div>
                    <div className="space-y-1">
                      <p className="text-blue-100/90 text-sm leading-relaxed font-medium  pl-4 border-l-2 border-purple-500/30">
                        {upgrade.effect}
                      </p>
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
};

// --- DIVINE MODALS ---
function DivineSkillModal({ skill, onClose }: { skill: any; onClose: () => void }) {
  const [activeRingIdx, setActiveRingIdx] = useState(0);
  if (!skill) return null;
  const currentRing = skill.rings?.[activeRingIdx];
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-xl" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-950/90 rounded-[3rem] w-full max-w-5xl h-[85vh] border border-yellow-500/20 shadow-[0_0_100px_rgba(234,179,8,0.1)] overflow-hidden relative flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-white/5 rounded-full transition-all hover:rotate-90 z-50"><X size={24} /></button>
        
        {/* LEFT SIDE: Skill Intro */}
        <div className="w-full md:w-[45%] bg-gradient-to-b from-yellow-500/5 to-transparent p-10 border-r border-white/5 flex flex-col shrink-0">
           <div className="w-24 h-24 rounded-[2rem] bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center text-yellow-500 mb-8 shadow-lg shadow-yellow-500/5 relative overflow-hidden">
             {skill.iconUrl ? (
               <Image
                 src={optimizeCloudinary(skill.iconUrl, 200) || skill.iconUrl}
                 alt={skill.name}
                 fill
                 className="object-cover"
               />
             ) : (
               <Zap size={48} />
             )}
           </div>
           <h2 className="text-3xl font-black text-yellow-500 uppercase tracking-tighter mb-4">{skill.name}</h2>
           <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Kỹ năng cơ bản</h4>
                 <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{formatText(skill.description)}</p>
              </div>
              {skill.notes?.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-white/5">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ghi chú hiệu ứng</h4>
                   <div className="space-y-4">
                      {skill.notes.map((note: string, idx: number) => {
                        const hasSeparator = note.includes(":");
                        const title = hasSeparator ? note.split(":")[0].trim() : "";
                        const content = hasSeparator ? note.split(":").slice(1).join(":").trim() : note;
                        return (
                          <div key={idx} className="bg-black/40 border border-yellow-500/10 rounded-[1.5rem] p-6 space-y-3 shadow-xl">
                             {title && (
                               <>
                                 <h5 className="text-sm font-black text-yellow-500 uppercase tracking-tighter">{title}</h5>
                                 <div className="h-px bg-white/5" />
                               </>
                             )}
                             <p className="text-sm text-slate-400 leading-relaxed font-medium whitespace-pre-wrap">
                                {formatText(content)}
                             </p>
                          </div>
                        );
                      })}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* RIGHT SIDE: Ring Progression */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
           {/* Ring Icons Selector */}
           <div className="flex justify-center gap-12 border-b border-white/5 shrink-0 bg-white/[0.02] py-10">
              {skill.rings?.map((ring: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveRingIdx(idx)}
                  className="relative flex flex-col items-center gap-3 transition-all group"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative overflow-hidden ${activeRingIdx === idx ? "border-yellow-500 bg-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.3)] scale-110" : "border-white/10 bg-white/5 hover:border-yellow-500/50 hover:scale-105"}`}>
                    {ring.iconUrl ? (
                      <Image
                        src={optimizeCloudinary(ring.iconUrl, 160) || ring.iconUrl}
                        alt={ring.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Crown
                        size={32}
                        className={
                          activeRingIdx === idx
                            ? "text-yellow-500"
                            : "text-slate-600 group-hover:text-yellow-500/50"
                        }
                      />
                    )}
                     
                     {/* Outer Ring Animation for active */}
                     {activeRingIdx === idx && (
                       <motion.div 
                        layoutId="ringGlow"
                        className="absolute -inset-3 rounded-full border-2 border-yellow-500/30 animate-pulse" 
                       />
                     )}

                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors max-w-[100px] text-center leading-none ${activeRingIdx === idx ? "text-yellow-500" : "text-slate-500 group-hover:text-slate-300"}`}>
                      {ring.name}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${activeRingIdx === idx ? "text-yellow-600" : "text-slate-700"}`}>
                      {ring.level}
                    </span>
                  </div>
                </button>
              ))}
           </div>

           {/* Ring Content */}
           <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {currentRing && (
                <>
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-[10px] font-black text-yellow-500/50 uppercase tracking-[0.3em] flex items-center gap-2">
                        <LayoutGrid size={12} /> Hiệu ứng niên hạn
                      </h4>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {["y50k", "y100k", "y500k", "y1000k"].map((y) => {
                        const desc = currentRing.yearEffects?.[y];
                        if (!desc) return null;
                        const isMax = y === "y1000k";
                        const label = y === "y50k" ? "5v" : y === "y100k" ? "10v" : y === "y500k" ? "50v" : "100v";
                        return (
                          <div key={y} className={`flex items-start gap-6 p-6 rounded-[2rem] border transition-all ${isMax ? "bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/5" : "bg-white/[0.03] border-white/10 hover:border-yellow-500/30"}`}>
                            <div className={`shrink-0 px-4 py-2 rounded-xl text-center min-w-[85px] mt-1 ${isMax ? "bg-red-500 text-white font-black shadow-lg shadow-red-500/20" : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-black"}`}>
                              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                            </div>
                            <p className={`text-sm leading-relaxed flex-1 whitespace-pre-wrap ${isMax ? "text-red-200" : "text-slate-300"}`}>{formatText(desc)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {currentRing.yearEffects?.y1000kBuffs?.some((b: string) => b.trim() !== "") && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-[10px] font-black text-yellow-500/50 uppercase tracking-[0.3em] flex items-center gap-2">
                          <ArrowUp size={12} /> Chỉ số cường hóa
                        </h4>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {currentRing.yearEffects.y1000kBuffs.map((buff: string, i: number) => (
                          buff.trim() !== "" && (
                            <div key={i} className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-5 py-3 flex items-center gap-6 hover:bg-yellow-500/10 transition-colors group/buff">
                              <span className="text-[10px] font-black text-yellow-600 uppercase min-w-[35px]">+{i + 1}</span>
                              <p className="text-xs text-slate-300 font-medium flex-1">{formatText(buff)}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DivineAvatarModal({ avatar, onClose }: { avatar: any; onClose: () => void }) {
  if (!avatar) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-950/90 rounded-[2.5rem] w-full max-w-2xl border border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.15)] p-8 md:p-10 relative flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 rounded-full transition-all hover:rotate-90 z-10"><X size={20} /></button>
        
        <div className="flex items-center gap-6 mb-8 shrink-0">
          <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5 relative overflow-hidden">
            {avatar.iconUrl ? (
              <Image
                src={optimizeCloudinary(avatar.iconUrl, 160) || avatar.iconUrl}
                alt={avatar.name}
                fill
                className="object-cover"
              />
            ) : (
              <ZapOff size={40} />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-blue-400 uppercase tracking-tighter">{avatar.name}</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Level {avatar.level}
              </span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pháp Tướng Thần Chỉ</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
          <section className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 relative group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <ZapOff size={100} />
            </div>
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Zap size={14} /> Kỹ năng pháp tướng
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap relative z-10">{avatar.skill || "Chưa có mô tả kỹ năng pháp tướng."}</p>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DivineWingModal({ wing, onClose }: { wing: any; onClose: () => void }) {
  if (!wing) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-xl" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-950/90 rounded-[3rem] w-full max-w-6xl h-[80vh] border border-pink-500/20 shadow-[0_0_100px_rgba(236,72,153,0.1)] overflow-hidden relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-white/5 rounded-full transition-all hover:rotate-90 z-50"><X size={24} /></button>
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-white/5 bg-gradient-to-r from-pink-500/10 to-transparent flex items-center gap-8 shrink-0">
           <div className="w-16 h-16 rounded-[1.5rem] bg-pink-500/10 border-2 border-pink-500/30 flex items-center justify-center text-pink-500 shadow-lg shadow-pink-500/5 relative overflow-hidden">
              {wing.iconUrl ? (
                <Image
                  src={optimizeCloudinary(wing.iconUrl, 160) || wing.iconUrl}
                  alt={wing.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Bone size={32} />
              )}
           </div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-pink-500 uppercase tracking-tighter">{wing.name}</h3>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-pink-400/50 uppercase tracking-[0.2em]">Divine Wing System</span>
              </div>
           </div>
        </div>

        {/* Two Panels */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
           {/* LEFT: Regular Skill */}
           <div className="flex-1 overflow-y-auto p-10 border-r border-white/5 custom-scrollbar space-y-8 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-slate-800 border border-white/5">
                    <Zap size={16} className="text-pink-400" />
                 </div>
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Kỹ năng thường</h4>
              </div>
              <div className="space-y-6">
                 <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{wing.regularSkill?.description || "Chưa có mô tả kỹ năng thường."}</p>
                 
                 {wing.regularSkill?.upgrades?.some((u: string) => u.trim() !== "") && (
                    <div className="grid grid-cols-1 gap-3 pt-4">
                       {wing.regularSkill.upgrades.map((up: any, i: number) => (
                         up.trim() !== "" && (
                           <div key={i} className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 flex gap-5 items-start group hover:bg-white/[0.05] transition-all">
                              <span className="shrink-0 w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-xs font-black text-pink-500">
                                 {i + 1}
                              </span>
                              <p className="text-[13px] text-slate-400 leading-relaxed font-medium">{up}</p>
                           </div>
                         )
                       ))}
                    </div>
                 )}
              </div>
           </div>

           {/* RIGHT: Mutated Skill */}
           <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8 bg-pink-500/[0.02]">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <Waves size={16} className="text-pink-500" />
                 </div>
                 <h4 className="text-[10px] font-black text-pink-500/50 uppercase tracking-[0.3em]">Kỹ năng suy biến</h4>
              </div>
              <div className="space-y-6">
                 <div className="bg-pink-500/5 p-8 rounded-[2rem] border border-pink-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Waves size={120} />
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed relative z-10 whitespace-pre-wrap">{wing.mutatedSkill?.description || "Chưa có mô tả kỹ năng suy biến."}</p>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroDetailClient({ hero }: { hero: any }) {
  if (!hero)
    return (
      <div className="p-10 text-white text-center min-h-screen bg-[#020617] flex items-center justify-center font-black uppercase tracking-widest animate-pulse">
        Hệ thống đang khởi tạo...
      </div>
    );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [selectedSeventhSkill, setSelectedSeventhSkill] = useState<any>(null);
  const [selectedBone, setSelectedBone] = useState<SoulBone | null>(null);
  const [selectedCard, setSelectedCard] = useState<NvvCard | null>(null);
  const [selectedDivineRing, setSelectedDivineRing] = useState<any>(null);
  const [selectedDivineSkill, setSelectedDivineSkill] = useState<any>(null);
  const [selectedDivineAvatar, setSelectedDivineAvatar] = useState<any>(null);
  const [selectedDivineWing, setSelectedDivineWing] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<"Tất Cả" | NvvCardType>(
    "Tất Cả",
  );

  // Drag-to-scroll state for filters
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!filterScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - filterScrollRef.current.offsetLeft);
    setScrollLeftState(filterScrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !filterScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - filterScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    filterScrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const isVinhVinh = hero?.name?.toLowerCase().includes("vinh vinh");
  const isTranTam = hero?.id === "cuc-han---kiem-dao-tran-tam";
  const isAmKhi = hero?.type === "Ám Khí";
  const isSP = hero?.rarity === "SP" || hero?.rarity === "SP+";
  const isSSR_Plus = hero?.rarity === "SSR+";
  const isDivine = hero?.rarity === "Thần Chỉ";

  const hasSkillGrid = hero?.rarity === "SP+";
  const hasVhct = !!(hero.vuHonChanThan && (hero.vuHonChanThan.trieuHoi?.name || hero.vuHonChanThan.chuDong?.name || hero.vuHonChanThan.biDong?.name));

  useEffect(() => {
    if (mounted && hero) {
      if (isAmKhi) setActiveTab("stars");
      else if (isDivine) setActiveTab("divine_rings");
      else if (hasSkillGrid) setActiveTab("skills");
      else setActiveTab("build");
    }
  }, [mounted, hero, isAmKhi, isDivine, hasSkillGrid]);

  if (!mounted || !hero)
    return (
      <div className="p-10 text-white text-center min-h-screen bg-[#020617] flex items-center justify-center font-black uppercase tracking-widest animate-pulse">
        ĐANG ĐỒNG BỘ DỮ LIỆU...
      </div>
    );

  const getSkillDetail = (
    heroData: any,
    skillIndex: number,
    typeCode: string,
  ) => {
    const skillId = `${heroData.id}-s${skillIndex + 1}-${typeCode}`;
    return heroData.skillDetails?.find((s: any) => s.id === skillId);
  };

  const filters: ("Tất Cả" | NvvCardType)[] = [
    "Tất Cả",
    "Thông Dụng",
    "Cửu Thải Lưu Ly · Tốc",
    "Lưu Ly Tâm Nguyên",
    "Cửu Thải Lưu Ly · Dụ",
    "Cửu Thải Lưu Ly · Diệu",
  ];
  const filteredCards =
    activeFilter === "Tất Cả"
      ? hero.nvvCardSystem?.cards
      : hero.nvvCardSystem?.cards.filter((c: any) => c.type === activeFilter);

  const rarityColor = isDivine ? "from-yellow-400 via-yellow-600 to-yellow-900" : isSP ? "from-fuchsia-500 to-indigo-600" : isSSR_Plus ? "from-red-600 to-red-900" : "from-amber-400 to-amber-700";
  const rarityShadow = isDivine ? "shadow-yellow-500/40" : isSP ? "shadow-fuchsia-500/20" : isSSR_Plus ? "shadow-red-600/20" : "shadow-amber-500/20";

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-32 relative font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020617_100%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10 opacity-30" />

      <AnimatePresence>
        {selectedSkill && <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />}
        {selectedSeventhSkill && <SeventhSkillModal skill={selectedSeventhSkill} onClose={() => setSelectedSeventhSkill(null)} />}
        {selectedBone && <SoulBoneModal bone={selectedBone} onClose={() => setSelectedBone(null)} />}
        {selectedCard && <NvvCardModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
        {selectedDivineSkill && <DivineSkillModal skill={selectedDivineSkill} onClose={() => setSelectedDivineSkill(null)} />}
        {selectedDivineAvatar && <DivineAvatarModal avatar={selectedDivineAvatar} onClose={() => setSelectedDivineAvatar(null)} />}
        {selectedDivineWing && <DivineWingModal wing={selectedDivineWing} onClose={() => setSelectedDivineWing(null)} />}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <nav className="relative z-50 max-w-7xl mx-auto p-8">
        <Link
          href="/soul-masters"
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-blue-500/30 backdrop-blur-md"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Thư viện nhân vật</span>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 px-8 relative z-20">
        {/* Left Column: Character Splash */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[3/4] w-full max-w-[280px] sm:max-w-[400px] lg:max-w-none mx-auto p-1 bg-gradient-to-b ${rarityColor} ${rarityShadow}`}
          >
            <div className="relative w-full h-full bg-[#020617] rounded-[2.8rem] overflow-hidden">
              {/* Floating Rarity Badge */}
              <div className="absolute top-6 left-6 z-30">
                <span className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase shadow-2xl border border-white/20 backdrop-blur-md bg-gradient-to-tr ${rarityColor}`}>
                  {hero.rarity}
                </span>
              </div>
              
              {/* Character Main Image */}
              <Image
                src={optimizeCloudinary(hero.image, 800) || hero.image}
                alt={hero.name}
                fill
                priority
                className="object-cover transition-transform duration-1000 hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              
              {/* Bottom Gradient Fade */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent p-10 pt-32">
                  <div className="space-y-4">
                     <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500 text-white font-black shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        <p className="text-[9px] uppercase tracking-widest truncate">
                          {hero.title || "Hồn Sư"}
                        </p>
                     </div>
                      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight text-white drop-shadow-2xl">
                        {hero.name}
                      </h1>
                    <div className="pt-4 flex flex-wrap gap-2">
                      <span className={`${hero.type === "Thần" ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] border-yellow-400" : "bg-white/10 text-slate-300 border-white/10"} backdrop-blur-md border px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500`}>
                        {hero.type}
                      </span>
                      {hero.attribute && (
                        <span className="bg-blue-600/10 backdrop-blur-md border border-blue-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400">
                          {hero.attribute}
                        </span>
                      )}
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Information Tabs */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          {/* TAB NAVIGATION */}
          <div className="flex gap-2 border-b border-white/5 mb-10 overflow-x-auto pb-4 custom-scrollbar-visible cursor-grab active:cursor-grabbing select-none">
            {isAmKhi ? (
              <TabButton active={activeTab === "stars"} onClick={() => setActiveTab("stars")} icon={<Star size={14} />} label="Hệ thống năng sao" color="rose" />
            ) : isDivine ? (
              <div className="flex gap-2">
                <TabButton active={activeTab === "divine_rings"} onClick={() => setActiveTab("divine_rings")} icon={<Dna size={14} />} label="Thần Hoàn" color="gold" />
                <TabButton active={activeTab === "divine_avatars"} onClick={() => setActiveTab("divine_avatars")} icon={<ArrowUp size={14} />} label="Pháp Tướng" color="gold" />
                <TabButton active={activeTab === "divine_wings"} onClick={() => setActiveTab("divine_wings")} icon={<Bone size={14} />} label="Cánh" color="gold" />
              </div>
            ) : (
              <div className="flex gap-2">
                 {!hasSkillGrid && <TabButton active={activeTab === "build"} onClick={() => setActiveTab("build")} icon={<LayoutGrid size={14} />} label="Hồn Hoàn" color="blue" />}
                 {hasSkillGrid && <TabButton active={activeTab === "skills"} onClick={() => setActiveTab("skills")} icon={<Zap size={14} />} label="Hệ thống kỹ năng" color="blue" />}
                 {isTranTam && <TabButton active={activeTab === "thien_phu"} onClick={() => setActiveTab("thien_phu")} icon={<Sparkles size={14} />} label="Thiên Phú" color="cyan" />}
                 {isVinhVinh && hero.nvvCardSystem && <TabButton active={activeTab === "nvv_cards"} onClick={() => setActiveTab("nvv_cards")} icon={<Gamepad2 size={14} />} label="Thẻ Bài" color="pink" />}
                 <TabButton active={activeTab === "bones"} onClick={() => setActiveTab("bones")} icon={<Shield size={14} />} label="Hồn Cốt" color="amber" />
                 {hasVhct && <TabButton active={activeTab === "vhct"} onClick={() => setActiveTab("vhct")} icon={<Crown size={14} />} label="Chân Thân" color="gold" />}
              </div>
            )}
          </div>

          <div className="mt-4">
            {/* NÂNG SAO & HIỆU ỨNG MẶC ĐỊNH (BUILDS) */}
            {activeTab === "build" && !hasSkillGrid && !isAmKhi && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {hero.builds?.map((build: any, idx: number) => {
                  const codes = build.title.match(/\d{4}/)?.[0].split("") || ["1", "1", "1", "1"];
                  return (
                    <div key={idx} className="bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl backdrop-blur-sm group hover:bg-white/[0.04] transition-all duration-500">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                          <LayoutGrid size={16} className="text-blue-400" />
                        </div>
                        <h4 className="text-sm font-black uppercase text-blue-500 italic tracking-[0.2em]">
                          {build.title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-4 gap-4 max-w-sm">
                        {codes.map((num: string, i: number) => {
                          const skill = getSkillDetail(hero, i, num);
                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-4 cursor-pointer group/skill"
                              onClick={() => skill && setSelectedSkill(skill)}
                            >
                              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 p-1 transition-all duration-500 group-hover/skill:scale-110 group-hover/skill:rotate-6 ${num === "1" ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-emerald-950/20" : "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)] bg-rose-950/20"}`}>
                                {skill?.iconUrl ? (
                                  <div className="w-full h-full relative rounded-full overflow-hidden">
                                    <Image src={optimizeCloudinary(skill.iconUrl, 160) || skill.iconUrl} alt="" fill className="object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-full text-xs font-black">
                                    {num}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/skill:text-slate-300 transition-colors">
                                  Skill {i + 1}
                                </span>
                                <div className={`w-1 h-1 rounded-full ${num === "1" ? "bg-emerald-500" : "bg-rose-500"} shadow-[0_0_5px_currentColor] animate-pulse`} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* KỸ NĂNG CHI TIẾT (GRID) */}
            {activeTab === "skills" && hasSkillGrid && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {hero.skillDetails?.map((skill: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-4 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 hover:border-blue-500/50 hover:bg-white/[0.05] transition-all cursor-pointer group shadow-xl"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/10 relative overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      {skill.iconUrl ? (
                        <Image src={optimizeCloudinary(skill.iconUrl, 160) || skill.iconUrl} alt={skill.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-xl font-black italic">
                          {index + 1}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-1 text-center w-full">
                       <p className="text-[10px] font-black uppercase text-blue-400/70 tracking-tighter opacity-70">
                         {skill.type}
                       </p>
                       <h4 className="text-[11px] font-black text-slate-200 truncate group-hover:text-white transition-colors uppercase italic tracking-tight">
                         {skill.name}
                       </h4>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ĐỆ THẤT HỒN KỸ */}
            {(activeTab === "build" || activeTab === "skills") && hero.seventhSkill && Object.values(hero.seventhSkill).some((s: any) => s?.name) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-8">
                <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest border-b border-rose-500/20 pb-4 mb-6 flex items-center gap-3">
                  <Sparkles size={24} /> Đệ Thất Hồn Kỹ
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[
                    { key: 'y250k', label: '25 Vạn Năm', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', hover: 'hover:border-rose-500/60 shadow-rose-500/5' },
                    { key: 'y350k', label: '35 Vạn Năm', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', hover: 'hover:border-rose-500/60 shadow-rose-500/5' },
                    { key: 'y400k', label: '40 Vạn Năm', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', hover: 'hover:border-red-500/60 shadow-red-500/5' },
                    { key: 'y450k', label: '45 Vạn Năm', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', hover: 'hover:border-red-500/60 shadow-red-500/5' },
                    { key: 'y500k', label: '50 Vạn Năm', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', hover: 'hover:border-yellow-500/60 shadow-yellow-500/5' },
                  ].map(({ key, label, color, bg, border, hover }) => {
                    const skill = hero.seventhSkill[key];
                    if (!skill?.name) return null;
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center gap-4 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 hover:bg-white/[0.05] hover:border-rose-500/30 transition-all cursor-pointer group shadow-xl"
                        onClick={() => setSelectedSeventhSkill({ ...skill, label, color, bg })}
                      >
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 ${border} ${hover} relative overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex items-center justify-center bg-slate-900`}>
                          {(skill as any).iconUrl ? (
                            <Image src={optimizeCloudinary((skill as any).iconUrl, 160) || (skill as any).iconUrl} alt={skill.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 font-black italic rounded-full text-slate-300">
                              <span className={`text-xl ${color}`}>{label.split(" ")[0]}</span>
                              <span className="text-[8px] uppercase tracking-tighter text-slate-500 font-bold -mt-0.5">Vạn Năm</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-1 text-center w-full">
                          <p className={`text-[9px] font-black uppercase ${color} tracking-wider`}>
                            {label}
                          </p>
                          <h4 className="text-[11px] font-black text-slate-200 truncate group-hover:text-white transition-colors uppercase italic tracking-tight">
                            {skill.name}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ĐỆ BÁT HỒN KỸ */}
            {(activeTab === "build" || activeTab === "skills") && hero.eighthSkill && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-8">
                <h3 className="text-2xl font-black text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-4 mb-6 flex items-center gap-3">
                  <Hexagon size={24} /> Đệ Bát Hồn Kỹ
                </h3>
                {/* Chủ động */}
                {hero.eighthSkill.active?.name && (
                  <div className="bg-gradient-to-br from-amber-500/5 to-transparent p-8 rounded-[2.5rem] border border-amber-500/20 relative shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap size={120} className="text-amber-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                        <Zap size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-500/50 tracking-[0.3em]">Kỹ năng chủ động</span>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-amber-400">{hero.eighthSkill.active.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                      {formatText(hero.eighthSkill.active.description)}
                    </p>
                  </div>
                )}

                {/* Bị động */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'honHoanSongHe', label: 'Hồn Hoàn Song Hệ', icon: <Dna size={20} /> },
                    { key: 'nguyenHonLuc', label: 'Nguyên Hồn Lực', icon: <Hexagon size={20} /> },
                    { key: 'uyApChanThan', label: 'Uy Áp Chân Thân', icon: <Shield size={20} /> },
                  ].map(({ key, label }) => {
                    const skill = hero.eighthSkill.passives?.[key as 'honHoanSongHe' | 'nguyenHonLuc' | 'uyApChanThan'];
                    if (!skill?.name) return null;
                    return (
                      <div key={key} className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6 hover:border-amber-500/30 transition-all group shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3 text-slate-400">
                            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                          </div>
                          <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                            Bị Động
                          </span>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xl font-black uppercase italic tracking-tighter text-amber-400 group-hover:text-amber-300 transition-colors">
                            {skill.name}
                          </h4>
                          {skill.unlockCondition && (
                            <div className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-500">
                              Mở khóa: {skill.unlockCondition}
                            </div>
                          )}
                          <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                            {formatText(skill.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ĐỆ CỬU HỒN KỸ */}
            {(activeTab === "build" || activeTab === "skills") && hero.ninthSkill && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-8">
                <h3 className="text-2xl font-black text-purple-500 uppercase tracking-widest border-b border-purple-500/20 pb-4 mb-6 flex items-center gap-3">
                  <Crown size={24} /> Đệ Cửu Hồn Kỹ
                </h3>
                {/* Chủ động */}
                {hero.ninthSkill.active?.name && (
                  <div className="bg-gradient-to-br from-purple-500/5 to-transparent p-8 rounded-[2.5rem] border border-purple-500/20 relative shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap size={120} className="text-purple-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                        <Zap size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-purple-500/50 tracking-[0.3em]">Kỹ năng chủ động</span>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-purple-400">{hero.ninthSkill.active.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                      {formatText(hero.ninthSkill.active.description)}
                    </p>
                  </div>
                )}

                {/* Bị động */}
                {hero.ninthSkill.passive?.name && (
                  <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6 hover:border-purple-500/30 transition-all group shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Crown size={20} className="text-purple-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-purple-400">Khí Nguyên Thần Khí</span>
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                        Bị Động
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black uppercase italic tracking-tighter text-purple-400 group-hover:text-purple-300 transition-colors">
                        {hero.ninthSkill.passive.name}
                      </h4>
                      {hero.ninthSkill.passive.unlockCondition && (
                        <div className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-500">
                          Mở khóa: {hero.ninthSkill.passive.unlockCondition}
                        </div>
                      )}
                      <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                        {formatText(hero.ninthSkill.passive.description)}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* THIÊN PHÚ TRẦN TÂM */}
            {activeTab === "thien_phu" && isTranTam && (
              <div className="relative w-full aspect-[16/9] bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="rainbowGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  {[RED_BRANCH, YELLOW_BRANCH, BLUE_BRANCH].map(
                    (branch, bIdx) =>
                      branch.map((node, i) => {
                        if (i === branch.length - 1) return null;
                        const next = branch[i + 1];
                        const color = next.special
                          ? "url(#rainbowGradient)"
                          : bIdx === 0
                            ? "#ef4444"
                            : bIdx === 1
                              ? "#eab308"
                              : "#3b82f6";
                        return (
                          <line
                            key={`${bIdx}-${i}`}
                            x1={node.x}
                            y1={node.y}
                            x2={next.x}
                            y2={next.y}
                            stroke={color}
                            strokeWidth={next.special ? "0.8" : "0.4"}
                            strokeDasharray={next.special ? "none" : "1 1"}
                            opacity={next.special ? "0.8" : "0.4"}
                          />
                        );
                      }),
                  )}
                </svg>
                {/* Vòng tròn cuối thiên phú */}
                <div className="absolute top-[50%] left-[92%] -translate-x-1/2 -translate-y-1/2 w-[35%] aspect-square border-2 border-double border-white/5 rounded-full flex items-center justify-center pointer-events-none">
                  <div className="w-[80%] aspect-square border border-dashed border-white/10 rounded-full animate-[spin_30s_linear_infinite]" />
                </div>
                {[RED_BRANCH, YELLOW_BRANCH, BLUE_BRANCH].map((branch, bIdx) =>
                  branch.map((node, i) => (
                    <div
                      key={`${bIdx}-${i}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <div
                        className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center bg-slate-900 transition-all group-hover:scale-125 ${node.special ? "rainbow-node-circle scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]" : ""}`}
                        style={{
                          borderColor: node.special
                            ? "transparent"
                            : bIdx === 0
                              ? "#ef4444"
                              : bIdx === 1
                                ? "#eab308"
                                : "#3b82f6",
                        }}
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${node.special ? "animate-pulse bg-white" : "opacity-40"}`}
                          style={{
                            backgroundColor: node.special
                              ? undefined
                              : bIdx === 0
                                ? "#ef4444"
                                : bIdx === 1
                                  ? "#eab308"
                                  : "#3b82f6",
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[6px] md:text-[8px] font-bold text-slate-500 uppercase whitespace-nowrap">
                        {node.l}
                      </div>
                    </div>
                  )),
                )}
              </div>
            )}

            {/* THẦN HOÀN (DIVINE RINGS) */}
            {activeTab === "divine_rings" && isDivine && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <div className="w-full max-w-4xl flex justify-between gap-10 p-16 bg-white/[0.02] rounded-[3rem] border border-white/5 relative shadow-2xl overflow-hidden">
                   {/* Background Glow */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.03)_0%,transparent_100%)]" />
                   
                   {hero.divineSystem?.branches?.map((branch: any, bIdx: number) => (
                     <div key={bIdx} className={`flex flex-col gap-8 relative z-10 ${bIdx === 1 ? "items-end" : "items-start"}`}>
                        {branch.skills?.map((skill: any, sIdx: number) => (
                          <motion.div
                            key={sIdx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDivineSkill(skill)}
                            className={`flex items-center gap-6 cursor-pointer group/skill ${bIdx === 1 ? "flex-row-reverse" : "flex-row"}`}
                          >
                             {/* Skill Icon */}
                             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border-2 border-yellow-500/30 flex items-center justify-center shadow-lg shadow-yellow-500/5 transition-all group-hover/skill:border-yellow-500 group-hover/skill:shadow-yellow-500/20 group-hover/skill:scale-110 relative overflow-hidden">
                               {skill.iconUrl ? (
                                 <Image
                                   src={optimizeCloudinary(skill.iconUrl, 160) || skill.iconUrl}
                                   alt={skill.name}
                                   fill
                                   className="object-cover"
                                 />
                               ) : (
                                 <Zap
                                   size={32}
                                   className="text-yellow-500 group-hover/skill:rotate-12 transition-transform"
                                 />
                               )}
                             </div>
                             
                             {/* Skill Name */}
                             <span className={`text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] transition-all duration-300 ${bIdx === 1 ? "text-right" : "text-left"} text-slate-500 group-hover/skill:text-yellow-500`}>
                                {skill.name}
                             </span>
                          </motion.div>
                        ))}
                     </div>
                   ))}
                </div>
                <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Chọn Thần Kỹ để xem chi tiết</p>
              </motion.div>
            )}

            {/* PHÁP TƯỚNG (DIVINE AVATARS) */}
            {activeTab === "divine_avatars" && isDivine && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hero.divineSystem?.avatars?.map((avatar: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedDivineAvatar(avatar)}
                    className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center gap-4 cursor-pointer hover:border-blue-500/50 hover:bg-white/[0.04] transition-all group shadow-xl"
                  >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-blue-500 font-black text-xl group-hover:scale-110 group-hover:rotate-6 transition-all relative overflow-hidden">
                      {avatar.iconUrl ? (
                        <Image
                          src={optimizeCloudinary(avatar.iconUrl, 160) || avatar.iconUrl}
                          alt={avatar.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        avatar.level
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-70">Pháp Tướng</p>
                      <h4 className="text-sm font-black text-blue-400 uppercase italic tracking-tight">{avatar.name}</h4>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* THẦN DỰC (DIVINE WINGS) */}
            {activeTab === "divine_wings" && isDivine && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <div className="w-full max-w-4xl flex justify-between gap-10 p-16 bg-white/[0.02] rounded-[3rem] border border-white/5 relative shadow-2xl overflow-hidden">
                   {/* Background Glow */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.03)_0%,transparent_100%)]" />
                   
                   {/* Cánh Trái */}
                   <div className="flex flex-col gap-8 relative z-10 items-start">
                      {hero.divineSystem?.wings?.left?.map((wing: any, idx: number) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDivineWing(wing)}
                          className="flex items-center gap-6 cursor-pointer group/wing"
                        >
                           <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-400/20 to-pink-600/10 border-2 border-pink-500/30 flex items-center justify-center shadow-lg shadow-pink-500/5 transition-all group-hover/wing:border-pink-500 group-hover/wing:shadow-pink-500/20 group-hover/wing:scale-110 relative overflow-hidden">
                              {wing.iconUrl ? (
                                <Image
                                  src={optimizeCloudinary(wing.iconUrl, 160) || wing.iconUrl}
                                  alt={wing.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Waves
                                  size={32}
                                  className="text-pink-500 group-hover/wing:rotate-12 transition-transform"
                                />
                              )}
                           </div>
                           <span className="text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] text-slate-500 group-hover/wing:text-pink-400 transition-colors">
                              {wing.name}
                           </span>
                        </motion.div>
                      ))}
                   </div>

                   {/* Cánh Phải */}
                   <div className="flex flex-col gap-8 relative z-10 items-end">
                      {hero.divineSystem?.wings?.right?.map((wing: any, idx: number) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDivineWing(wing)}
                          className="flex flex-row-reverse items-center gap-6 cursor-pointer group/wing"
                        >
                           <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-400/20 to-pink-600/10 border-2 border-pink-500/30 flex items-center justify-center shadow-lg shadow-pink-500/5 transition-all group-hover/wing:border-pink-500 group-hover/wing:shadow-pink-500/20 group-hover/wing:scale-110 relative overflow-hidden">
                              {wing.iconUrl ? (
                                <Image
                                  src={optimizeCloudinary(wing.iconUrl, 160) || wing.iconUrl}
                                  alt={wing.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Waves
                                  size={32}
                                  className="text-pink-500 rotate-180 group-hover/wing:-rotate-192 transition-transform"
                                />
                              )}
                           </div>
                           <span className="text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] text-right text-slate-500 group-hover/wing:text-pink-400 transition-colors">
                              {wing.name}
                           </span>
                        </motion.div>
                      ))}
                   </div>
                </div>
                <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Chọn Thần Dực để xem chi tiết</p>
              </motion.div>
            )}

            {/* THẺ BÀI VINH VINH (ROLEPLAY CARDS) */}
            {activeTab === "nvv_cards" && isVinhVinh && hero.nvvCardSystem && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 w-full overflow-hidden">
                <div 
                  ref={filterScrollRef}
                  className={`pb-4 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none ${isDragging ? "cursor-grabbing" : ""}`}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <div className="flex gap-2 min-w-max px-1">
                    {filters.map((f) => {
                      const count = f === "Tất Cả" 
                        ? hero.nvvCardSystem?.cards?.length || 0
                        : hero.nvvCardSystem?.cards?.filter((c: any) => c.type === f).length || 0;
                      return (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${activeFilter === f ? "bg-pink-600 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300"}`}
                        >
                          {f} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {filteredCards?.map((card: any) => (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="cursor-pointer group relative rounded-[2rem] overflow-hidden border-2 border-white/5 bg-slate-950 aspect-[3/4] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-pink-500/50"
                    >
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-pink-600/90 backdrop-blur-md text-white text-[8px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest border border-white/20">
                          {card.type === "Thông Dụng" ? "Thông Dụng" : "Chuyên Thuộc"}
                        </span>
                      </div>
                      <Image
                        src={optimizeCloudinary(card.image, 400) || card.image}
                        alt={card.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent opacity-80" />
                      <div className="absolute bottom-0 inset-x-0 p-5 pt-20">
                        <h4 className="text-xs font-black text-white uppercase tracking-tight group-hover:text-pink-400 transition-colors leading-relaxed">
                          {card.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* HỒN CỐT (SOUL BONES) */}
            {activeTab === "bones" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hero.soulBones
                  ?.filter((bone: any) => bone.name && bone.name.trim() !== "")
                  ?.map((bone: any, i: number) => {
                    const isMutated = !!bone.mutation?.name;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedBone(bone)}
                        className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 cursor-pointer hover:border-amber-500/50 hover:bg-white/[0.05] transition-all group shadow-xl backdrop-blur-sm"
                      >
                        <div className={`w-16 h-16 rounded-[1.2rem] bg-slate-900 border-2 flex items-center justify-center shrink-0 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isMutated ? "border-rose-500/30 shadow-rose-500/10" : "border-amber-500/30 shadow-amber-500/10"}`}>
                          {bone.iconUrl ? (
                            <Image src={optimizeCloudinary(bone.iconUrl, 160) || bone.iconUrl} alt="" width={64} height={64} className="object-cover rounded-[1rem]" />
                          ) : (
                            <Hexagon className={isMutated ? "text-rose-500" : "text-amber-500"} size={28} />
                          )}
                        </div>
                        <div className="overflow-hidden space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-70">
                            {bone.position}
                          </p>
                          <h4 className={`text-sm font-black italic uppercase tracking-tight transition-colors leading-snug ${isMutated ? "text-rose-400 group-hover:text-rose-300" : "text-slate-200 group-hover:text-amber-400"}`}>
                            {bone.name}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
              </motion.div>
            )}

            {/* ÁM KHÍ (STAR UPGRADES) */}
            {activeTab === "stars" && isAmKhi && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {hero.amKhiNote && (
                  <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-[2rem] flex gap-4 text-xs italic text-rose-200 shadow-inner backdrop-blur-sm">
                    <Info className="shrink-0 text-rose-500" size={18} />
                    <p className="font-medium leading-relaxed">{hero.amKhiNote}</p>
                  </div>
                )}
                <div className="grid gap-4">
                  {hero.starUpgrades?.map((up: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white/[0.02] p-6 pr-8 rounded-[2rem] border border-white/5 flex gap-6 items-start shadow-xl hover:border-red-500/30 transition-all group"
                    >
                      <div
                        className={`px-4 py-2 rounded-xl border-2 font-black text-sm flex items-center gap-2 shrink-0 shadow-2xl transition-all duration-500 group-hover:scale-110 ${up.isRedStar ? "border-rose-600 text-rose-500 bg-rose-500/10" : "border-amber-400 text-amber-500 bg-amber-500/10"}`}
                      >
                        {up.star > 5 ? up.star - 5 : up.star} <Star size={14} fill="currentColor" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest opacity-70 group-hover:text-slate-300 transition-colors">
                           Upgrade Module
                         </p>
                         <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                           {up.description}
                         </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VŨ HỒN CHÂN THÂN (MARTIAL SOUL TRUE BODY) */}
            {activeTab === "vhct" && hasVhct && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                

                <div className="grid grid-cols-1 gap-8">
                  {/* Kỹ Năng Triệu Hồi */}
                  {hero.vuHonChanThan?.trieuHoi?.name && (
                    <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-5">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-slate-900 shadow-lg shadow-blue-500/5 flex items-center justify-center shrink-0">
                            {hero.vuHonChanThan.trieuHoi.avatar ? (
                              <Image
                                src={optimizeCloudinary(hero.vuHonChanThan.trieuHoi.avatar, 160) || hero.vuHonChanThan.trieuHoi.avatar}
                                alt={hero.vuHonChanThan.trieuHoi.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <Zap className="text-blue-400" size={28} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">{hero.vuHonChanThan.trieuHoi.name}</h4>
                            <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em]">Triệu Hồi</span>
                          </div>
                        </div>
                      </div>
                      
                      {hero.vuHonChanThan.trieuHoi.summonCondition && (
                        <div className="self-start sm:self-center bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl text-xs font-bold text-blue-400">
                          Điều kiện: {hero.vuHonChanThan.trieuHoi.summonCondition}
                        </div>
                      )}
                      <div className="space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                          {formatText(hero.vuHonChanThan.trieuHoi.description)}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                        {hero.vuHonChanThan.trieuHoi.y200k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-blue-400 font-black text-xs flex items-center gap-1">
                              20 Vạn Năm (1★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.trieuHoi.y200k)}
                            </p>
                          </div>
                        )}
                        {hero.vuHonChanThan.trieuHoi.y400k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-blue-400 font-black text-xs flex items-center gap-1">
                              40 Vạn Năm (3★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.trieuHoi.y400k)}
                            </p>
                          </div>
                        )}
                        {hero.vuHonChanThan.trieuHoi.y1400k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-blue-400 font-black text-xs flex items-center gap-1">
                              140 Vạn Năm (4★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.trieuHoi.y1400k)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Chủ Động */}
                  {hero.vuHonChanThan.chuDong?.name && (
                    <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-300 shadow-xl space-y-6">
                      <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-slate-900 shadow-lg shadow-purple-500/5 flex items-center justify-center shrink-0">
                          {hero.vuHonChanThan.chuDong.avatar ? (
                            <Image
                              src={optimizeCloudinary(hero.vuHonChanThan.chuDong.avatar, 160) || hero.vuHonChanThan.chuDong.avatar}
                              alt={hero.vuHonChanThan.chuDong.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Zap className="text-purple-400" size={28} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">{hero.vuHonChanThan.chuDong.name}</h4>
                          <span className="text-[10px] font-black uppercase text-purple-400 tracking-[0.2em]">Chủ Động</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                          {formatText(hero.vuHonChanThan.chuDong.description)}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                        {hero.vuHonChanThan.chuDong.y600k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-purple-400 font-black text-xs flex items-center gap-1">
                              60 Vạn Năm (2★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.chuDong.y600k)}
                            </p>
                          </div>
                        )}
                        {hero.vuHonChanThan.chuDong.y1200k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-purple-400 font-black text-xs flex items-center gap-1">
                              120 Vạn Năm (4★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.chuDong.y1200k)}
                            </p>
                          </div>
                        )}
                        {hero.vuHonChanThan.chuDong.y2000k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-purple-400 font-black text-xs flex items-center gap-1">
                              200 Vạn Năm (5★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.chuDong.y2000k)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bị Động */}
                  {hero.vuHonChanThan.biDong?.name && (
                    <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/30 transition-all duration-300 shadow-xl space-y-6">
                      <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-500/30 bg-slate-900 shadow-lg shadow-orange-500/5 flex items-center justify-center shrink-0">
                          {hero.vuHonChanThan.biDong.avatar ? (
                            <Image
                              src={optimizeCloudinary(hero.vuHonChanThan.biDong.avatar, 160) || hero.vuHonChanThan.biDong.avatar}
                              alt={hero.vuHonChanThan.biDong.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Zap className="text-orange-400" size={28} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">{hero.vuHonChanThan.biDong.name}</h4>
                          <span className="text-[10px] font-black uppercase text-orange-400 tracking-[0.2em]">Bị Động</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                          {formatText(hero.vuHonChanThan.biDong.description)}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        {hero.vuHonChanThan.biDong.y800k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-orange-400 font-black text-xs flex items-center gap-1">
                              80 Vạn Năm (3★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.biDong.y800k)}
                            </p>
                          </div>
                        )}
                        {hero.vuHonChanThan.biDong.y2000k && (
                          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all space-y-2">
                            <span className="text-orange-400 font-black text-xs flex items-center gap-1">
                              200 Vạn Năm (5★)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {formatText(hero.vuHonChanThan.biDong.y2000k)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />

      <style jsx global>{`
        .rainbow-node-circle {
          background: linear-gradient(
            45deg,
            #f43f5e,
            #8b5cf6,
            #06b6d4
          ) !important;
          border-radius: 9999px !important;
          border: 2px solid rgba(255, 255, 255, 0.8) !important;
          animation: rainbowRotate 3s linear infinite;
        }
        @keyframes rainbowRotate {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }
        .custom-scrollbar-visible::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar-visible::-webkit-scrollbar-thumb {
          background: #db2777;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
