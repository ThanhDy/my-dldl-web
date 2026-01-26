"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  SoulMaster,
  SkillDetail,
  SoulBone,
  NvvCard,
  NvvCardType,
} from "@/data/types";
import {
  FaArrowLeft,
  FaTimes,
  FaBone,
  FaStar,
  FaBolt,
  FaInfoCircle,
  FaArrowUp,
  FaDna,
} from "react-icons/fa";
import { GiSnakeSpiral } from "react-icons/gi";

// --- TYPES & INTERFACES ---
interface TalentNode { 
  x: number; 
  y: number; 
  l: string; 
  special?: boolean; 
}

// --- THIÊN PHÚ (DÀNH RIÊNG CHO TRẦN TÂM) ---
const RED_BRANCH: TalentNode[] = [
  { x: 8, y: 20, l: "0/19" }, { x: 15, y: 10, l: "0/4" }, { x: 25, y: 25, l: "0/4" },
  { x: 35, y: 12, l: "0/4" }, { x: 45, y: 28, l: "0/4" }, { x: 55, y: 15, l: "0/4" },
  { x: 65, y: 30, l: "0/4" }, { x: 78, y: 25, l: "0/4" }, { x: 92, y: 50, l: "0/4", special: true }
];

const YELLOW_BRANCH: TalentNode[] = [
  { x: 8, y: 50, l: "0/15" }, { x: 18, y: 40, l: "0/4" }, { x: 28, y: 55, l: "0/4" },
  { x: 38, y: 45, l: "0/4" }, { x: 48, y: 60, l: "0/4" }, { x: 58, y: 50, l: "0/4" },
  { x: 68, y: 65, l: "0/4" }, { x: 78, y: 75, l: "0/4" }, { x: 92, y: 50, l: "0/4", special: true }
];

const BLUE_BRANCH: TalentNode[] = [
  { x: 8, y: 85, l: "0/11" }, { x: 20, y: 75, l: "0/9" }, { x: 32, y: 90, l: "0/4" },
  { x: 44, y: 80, l: "0/4" }, { x: 56, y: 92, l: "0/4" }
];

const YEAR_LABELS: Record<string, string> = {
  y1k: "1k Năm",
  y10k: "10k Năm",
  y25k: "25k Năm",
  y50k: "50k Năm",
  y100k: "100k Năm",
};

const YEAR_ORDER = ["y1k", "y10k", "y25k", "y50k", "y100k"];

const renderStarBadge = (count: number, colorClass: string) => (
  <span className={`inline-flex items-center gap-0.5 mx-1 ${colorClass}`}>
    <span className="text-xl font-extrabold leading-none">{count}</span>
    <FaStar size={14} className="mb-0.5" />
  </span>
);


function SkillModal({ skill, onClose }: { skill: SkillDetail | null; onClose: () => void }) {
  if (!skill) return null;
  const isSpider = skill.soulRingType?.includes("Ma Nhện") || skill.soulRingType?.includes("Giáp Thuẫn");
  const iconColorClass = isSpider ? "text-red-500 border-red-500" : "text-green-500 border-green-500";

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn cursor-pointer" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-slate-700 shadow-2xl cursor-default no-scrollbar p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-700/50 rounded-full transition z-20"><FaTimes /></button>
        <div className="flex items-center gap-4 border-b border-slate-700 pb-4 mb-4">
          <div className={`w-16 h-16 rounded-full border-2 relative overflow-hidden shrink-0 ${iconColorClass}`}>
            {skill.iconUrl ? <Image src={skill.iconUrl} alt={skill.name} fill className="object-cover" /> : <GiSnakeSpiral className="w-full h-full p-2 text-green-500" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{skill.name}</h3>
            <div className="flex gap-2 mt-1 text-sm">
              <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded">{skill.type}</span>
              <span className={`${isSpider ? 'bg-red-600/30 text-red-300' : 'bg-green-600/30 text-green-300'} px-2 py-0.5 rounded`}>{skill.soulRingType}</span>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
            {skill.description || <span className="italic text-slate-500">Chưa có mô tả</span>}
          </div>
          <div className="space-y-3">
            {YEAR_ORDER.map((key) => {
              const desc = (skill.yearEffects as any)?.[key];
              if (!desc) return null;
              return (
                <div key={key} className="flex gap-3 bg-slate-900/40 p-3 rounded-lg border-l-4 border-blue-500">
                  <span className="font-bold text-blue-400 whitespace-nowrap min-w-[80px]">{YEAR_LABELS[key]}</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SoulBoneModal({ bone, onClose }: { bone: SoulBone | null; onClose: () => void }) {
  if (!bone) return null;
  const isMutated = !!bone.mutation?.name;
  const isUpgraded = !!bone.upgrade?.name;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn cursor-pointer" onClick={onClose}>
      <div className={`bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-2 shadow-2xl p-6 transition-all duration-300 ${isMutated ? 'border-red-600 shadow-red-900/50' : 'border-yellow-500 shadow-yellow-500/20'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full z-20 transition"><FaTimes /></button>
        <div className="pt-8 pb-6 px-6 flex flex-col items-center justify-center border-b border-slate-800 mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hồn Cốt {bone.position}</span>
          <h2 className={`text-2xl font-bold text-center ${isMutated ? 'text-red-400' : 'text-yellow-400'}`}>{bone.name}</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
             <h3 className="text-yellow-500 font-bold uppercase mb-3 text-xs flex items-center gap-2"><FaBone /> Hiệu quả cơ bản</h3>
             <p className="text-slate-300 text-sm leading-relaxed">{bone.standard?.base}</p>
             {bone.standard?.star4 && <div className="mt-3"><span className="text-yellow-400 font-bold">{renderStarBadge(4, "text-yellow-400")}:</span> <span className="text-slate-300 text-sm">{bone.standard.star4}</span></div>}
             {bone.standard?.star6 && <div className="mt-2"><span className="text-yellow-500 font-bold">{renderStarBadge(6, "text-yellow-500")}:</span> <span className="text-slate-300 text-sm">{bone.standard.star6}</span></div>}
          </div>
          {isUpgraded && bone.upgrade && (
            <div className="bg-cyan-900/10 p-4 rounded-lg border border-cyan-900/30 animate-fadeIn">
              <h3 className="text-cyan-400 font-bold uppercase mb-2 flex items-center gap-2 text-xs"><FaArrowUp /> Hiệu quả Nâng Cấp</h3>
              <p className="text-cyan-100 text-sm mb-3 font-bold">{bone.upgrade.name}</p>
              {bone.upgrade.star2 && <div className="mt-1 text-slate-300 text-sm"><span className="text-cyan-400">{renderStarBadge(2, "text-cyan-400")}:</span> {bone.upgrade.star2}</div>}
              {bone.upgrade.star3 && <div className="mt-2 text-slate-300 text-sm"><span className="text-cyan-400">{renderStarBadge(3, "text-cyan-400")}:</span> {bone.upgrade.star3}</div>}
              {bone.upgrade.star5 && <div className="mt-2 text-slate-300 text-sm"><span className="text-cyan-400">{renderStarBadge(5, "text-cyan-400")}:</span> {bone.upgrade.star5}</div>}
            </div>
          )}
          {isMutated && bone.mutation && (
            <div className="bg-red-900/10 p-4 rounded-lg border border-red-900/30 animate-fadeIn">
              <h3 className="text-red-500 font-bold uppercase mb-2 flex items-center gap-2 text-xs"><FaDna /> Hiệu quả Suy Biến</h3>
              <p className="text-red-200 text-sm mb-3 font-bold">{bone.mutation.name}</p>
              {bone.mutation.star1Red && <div className="mt-1"><span className="text-red-500 font-bold">{renderStarBadge(1, "text-red-500")}:</span> <span className="text-slate-300 text-sm">{bone.mutation.star1Red}</span></div>}
              {bone.mutation.star6Red && <div className="mt-2"><span className="text-red-500 font-bold">{renderStarBadge(6, "text-red-500")}:</span> <span className="text-slate-300 text-sm">{bone.mutation.star6Red}</span></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const NvvCardModal = ({ card, onClose }: { card: NvvCard; onClose: () => void }) => {
  if (!card) return null;
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn cursor-pointer" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-slate-400 hover:text-white transition-colors"><FaTimes /></button>
        <div className="w-full md:w-[45%] shrink-0 bg-slate-950 p-8 flex flex-col items-center justify-center border-r border-slate-800 text-center">
            <div className="w-full max-w-[240px] rounded-xl overflow-hidden border-2 border-pink-400 relative aspect-[3/4] shadow-2xl mx-auto mb-4">
                <Image src={card.image} alt={card.name} fill className="object-cover" sizes="240px" />
            </div>
            <div className="bg-pink-600/20 border border-pink-500/50 px-4 py-1.5 rounded-full shadow-lg">
                <span className="text-pink-400 font-black uppercase text-xs tracking-widest">{card.name}</span>
            </div>
        </div>
        <div className="w-full md:w-[55%] bg-slate-900/50 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <h3 className="text-2xl font-bold text-white uppercase">{card.name}</h3>
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
            <h4 className="text-pink-400 font-bold text-sm uppercase mb-3 flex items-center gap-2"><FaBolt /> Kỹ Năng Cơ Bản</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{card.basicSkill}</p>
          </div>
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
            <h4 className="text-blue-400 font-bold text-sm uppercase mb-3 flex items-center gap-2"><FaInfoCircle /> Hiệu Ứng Chi Tiết</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{card.detailedEffect.effect}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HeroDetailClient({ hero }: { hero: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [selectedBone, setSelectedBone] = useState<SoulBone | null>(null);
  const [selectedCard, setSelectedCard] = useState<NvvCard | null>(null);
  const [activeFilter, setActiveFilter] = useState<"Tất Cả" | NvvCardType>("Tất Cả");

  const isVinhVinh = hero?.name?.toLowerCase().includes("vinh vinh");
  const isTranTam = hero?.id === "cuc-han---kiem-dao-tran-tam";
  const isAmKhi = hero?.type === "Ám Khí";
  const isRainbowRarity = hero?.rarity === "SP" || hero?.rarity === "SP+"; 
  const isSsrPlus = hero?.rarity === "SSR+";
  
  const hasSkillGrid = isVinhVinh || isTranTam;

  useEffect(() => {
    if (mounted && hero) {
      if (isAmKhi) setActiveTab("stars");
      else if (hasSkillGrid) setActiveTab("skills");
      else setActiveTab("build");
    }
  }, [mounted, hero, isAmKhi, hasSkillGrid]);

  if (!mounted || !hero) return <div className="p-10 text-white text-center min-h-screen bg-slate-950 font-bold uppercase tracking-widest">ĐANG TẢI...</div>;

  const getSkillDetail = (heroData: any, skillIndex: number, typeCode: string) => {
    const skillId = `${heroData.id}-s${skillIndex + 1}-${typeCode}`;
    return heroData.skillDetails?.find((s: any) => s.id === skillId);
  };

  const filters: ("Tất Cả" | NvvCardType)[] = ["Tất Cả", "Thông Dụng", "Cửu Thải Lưu Ly · Tốc", "Lưu Ly Tâm Nguyên", "Cửu Thải Lưu Ly · Dụ", "Cửu Thải Lưu Ly · Diệu"];
  const filteredCards = activeFilter === "Tất Cả" ? hero.nvvCardSystem?.cards : hero.nvvCardSystem?.cards.filter((c: any) => c.type === activeFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 relative font-sans selection:bg-pink-500/30">
      {selectedSkill && <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />}
      {selectedBone && <SoulBoneModal bone={selectedBone} onClose={() => setSelectedBone(null)} />}
      {selectedCard && <NvvCardModal card={selectedCard} onClose={() => setSelectedCard(null)} />}

      <div className="p-6 max-w-6xl mx-auto">
        <Link href="/soul-masters" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"><FaArrowLeft /> Quay lại kho tướng</Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
        <div className="lg:col-span-1">
          {/* VIỀN THEO ĐỘ HIẾM */}
          <div className={`rounded-2xl overflow-hidden border-4 relative shadow-2xl aspect-[3/4] w-full ${
            isRainbowRarity 
              ? "border-transparent bg-gradient-to-tr from-rose-400 via-fuchsia-500 via-indigo-500 to-cyan-400 p-[4px] shadow-fuchsia-500/20" 
              : isSsrPlus ? "border-red-600 shadow-red-600/30" : "border-yellow-500 shadow-yellow-500/20"
          }`}>
            <div className="relative w-full h-full bg-slate-900 rounded-[12px] overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded font-bold text-sm border shadow-lg ${
                    isRainbowRarity 
                    ? "bg-gradient-to-tr from-rose-400 via-fuchsia-500 via-indigo-500 to-cyan-400 text-white border-white/40" 
                    : isSsrPlus ? "bg-red-600 text-white border-red-400" : "bg-yellow-500 text-black"
                  }`}>{hero.rarity}</span>
                </div>
                <Image src={hero.image} alt={hero.name} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                  <p className="text-yellow-400 font-medium text-sm tracking-wider mb-1">{hero.title}</p>
                  <h1 className="text-2xl font-black uppercase tracking-tight italic">{hero.name}</h1>
                  <div className="flex gap-2 mt-2"><span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300">{hero.type}</span></div>
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* NAVIGATION TABS */}
          <div className="flex gap-4 border-b border-slate-800 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {isAmKhi ? (
              <button onClick={() => setActiveTab("stars")} className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "stars" ? "border-red-500 text-red-500" : "border-transparent text-slate-500"}`}>Nâng Sao</button>
            ) : (
              <>
                {!hasSkillGrid && <button onClick={() => setActiveTab("build")} className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "build" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}>Hồn Hoàn</button>}
                {hasSkillGrid && <button onClick={() => setActiveTab("skills")} className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "skills" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}>Kỹ Năng</button>}
              </>
            )}
            {isTranTam && <button onClick={() => setActiveTab("thien_phu")} className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "thien_phu" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-500"}`}>Thiên Phú</button>}
            {isVinhVinh && hero.nvvCardSystem && <button onClick={() => setActiveTab("nvv_cards")} className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "nvv_cards" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-500"}`}>Thẻ Bài</button>}
            <button onClick={() => setActiveTab("bones")} className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "bones" ? "border-yellow-500 text-yellow-400" : "border-transparent text-slate-500"}`}>Hồn Cốt</button>
          </div>

          <div className="mt-4">
            {/* HỒN HOÀN */}
            {activeTab === "build" && !hasSkillGrid && !isAmKhi && (
              <div className="space-y-4 animate-fadeIn">
                {hero.builds?.map((build: any, idx: number) => {
                   const codes = build.title.match(/\d{4}/)?.[0].split("") || ["1","1","1","1"];
                   return (
                    <div key={idx} className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/50 shadow-lg">
                      <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] mb-4">{build.title}</h4>
                      <div className="flex gap-4">
                        {codes.map((num: string, i: number) => {
                          const skill = getSkillDetail(hero, i, num);
                          return (
                            <div key={i} className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => skill && setSelectedSkill(skill)}>
                              <div className={`w-12 h-12 rounded-full border-2 p-0.5 transition-transform group-hover:scale-110 ${num === "1" ? "border-green-600 bg-green-950/20" : "border-red-600 bg-red-950/20"}`}>
                                {skill?.iconUrl ? <div className="w-full h-full relative rounded-full overflow-hidden"><Image src={skill.iconUrl} alt="" fill className="object-cover" /></div> : <span className="text-xs font-bold flex items-center justify-center h-full bg-slate-800 rounded-full">{num}</span>}
                              </div>
                              <span className="text-[8px] font-black text-slate-600 uppercase">Skill {i+1}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* KỸ NĂNG CHI TIẾT */}
            {activeTab === "skills" && hasSkillGrid && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                {hero.skillDetails?.map((skill: any, index: number) => (
                  <div key={index} className="flex flex-col items-center gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800 hover:border-blue-500 transition cursor-pointer" onClick={() => setSelectedSkill(skill)}>
                    <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 relative overflow-hidden shadow-md">
                      {skill.iconUrl ? <Image src={skill.iconUrl} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xl font-bold">{index + 1}</div>}
                    </div>
                    <p className="text-[10px] font-bold text-center text-slate-200 truncate w-full px-1">{skill.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* THIÊN PHÚ TRẦN TÂM */}
            {activeTab === "thien_phu" && isTranTam && (
              <div className="relative w-full aspect-[16/9] bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f43f5e" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  {[RED_BRANCH, YELLOW_BRANCH, BLUE_BRANCH].map((branch, bIdx) => (
                    branch.map((node, i) => {
                      if (i === branch.length - 1) return null;
                      const next = branch[i+1];
                      const color = next.special ? "url(#rainbowGradient)" : (bIdx === 0 ? "#ef4444" : bIdx === 1 ? "#eab308" : "#3b82f6");
                      return ( <line key={`${bIdx}-${i}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y} stroke={color} strokeWidth={next.special ? "0.8" : "0.4"} strokeDasharray={next.special ? "none" : "1 1"} opacity={next.special ? "0.8" : "0.4"} /> );
                    })
                  ))}
                </svg>
                {/* Vòng tròn cuối thiên phú */}
                <div className="absolute top-[50%] left-[92%] -translate-x-1/2 -translate-y-1/2 w-[35%] aspect-square border-2 border-double border-white/5 rounded-full flex items-center justify-center pointer-events-none">
                  <div className="w-[80%] aspect-square border border-dashed border-white/10 rounded-full animate-[spin_30s_linear_infinite]" />
                </div>
                {[RED_BRANCH, YELLOW_BRANCH, BLUE_BRANCH].map((branch, bIdx) => (
                  branch.map((node, i) => (
                    <div key={`${bIdx}-${i}`} className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                      <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center bg-slate-900 transition-all group-hover:scale-125 ${node.special ? 'rainbow-node-circle scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''}`} style={{ borderColor: node.special ? 'transparent' : (bIdx === 0 ? "#ef4444" : bIdx === 1 ? "#eab308" : "#3b82f6") }}>
                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${node.special ? 'animate-pulse bg-white' : 'opacity-40'}`} style={{ backgroundColor: node.special ? undefined : (bIdx === 0 ? "#ef4444" : bIdx === 1 ? "#eab308" : "#3b82f6") }} />
                      </div>
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[6px] md:text-[8px] font-bold text-slate-500 uppercase whitespace-nowrap">{node.l}</div>
                    </div>
                  ))
                ))}
              </div>
            )}

            {/* THẺ BÀI VINH VINH */}
            {activeTab === "nvv_cards" && isVinhVinh && hero.nvvCardSystem && (
              <div className="space-y-6 animate-fadeIn">
                <div className="pb-4 overflow-x-auto custom-scrollbar-visible">
                  <div className="flex gap-2 min-w-max pr-4">
                    {filters.map((f) => (
                      <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${activeFilter === f ? "bg-pink-600 text-white border-pink-500" : "bg-slate-800 text-slate-400 border-slate-700"}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredCards?.map((card: any) => (
                    <div key={card.id} onClick={() => setSelectedCard(card)} className="cursor-pointer group relative rounded-xl overflow-hidden border-2 border-pink-500/50 aspect-[3/4] shadow-lg">
                      {/* TAG LOẠI THẺ */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                          {card.type}
                        </span>
                      </div>
                      <Image src={card.image} alt={card.name} fill className="object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black p-3 pt-10"><h4 className="text-[10px] font-bold text-white truncate group-hover:text-pink-400">{card.name}</h4></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HỒN CỐT */}
            {activeTab === "bones" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-fadeIn">
                {hero.soulBones?.map((bone: any, i: number) => (
                  <div key={i} onClick={() => setSelectedBone(bone)} className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-yellow-600 transition-all group shadow-md">
                    <div className={`w-10 h-10 rounded bg-black/40 border flex items-center justify-center shrink-0 ${bone.mutation?.name ? 'border-red-600/30' : 'border-yellow-600/30'}`}>
                      {bone.iconUrl ? <Image src={bone.iconUrl} alt="" width={40} height={40} className="object-cover" /> : <FaBone className="text-slate-700" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[8px] font-bold text-slate-500 uppercase truncate">{bone.position}</p>
                      <h4 className={`text-[10px] font-bold truncate transition-colors ${bone.mutation?.name ? 'text-red-400 group-hover:text-red-500' : 'text-slate-200 group-hover:text-yellow-500'}`}>{bone.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB NÂNG SAO ÁM KHÍ */}
            {activeTab === "stars" && isAmKhi && (
              <div className="space-y-4 animate-fadeIn">
                {hero.amKhiNote && (
                    <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl flex gap-3 text-xs italic text-red-200 shadow-inner">
                        <FaInfoCircle className="shrink-0 mt-0.5" /> <p>{hero.amKhiNote}</p>
                    </div>
                )}
                {hero.starUpgrades?.map((up: any, i: number) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex gap-4 items-start shadow-lg hover:border-red-500/30 transition-all">
                    <div className={`px-2 py-1 rounded border font-bold text-xs flex items-center gap-1 shrink-0 ${up.isRedStar ? 'border-red-500 text-red-500 bg-red-950/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-yellow-500 text-yellow-500 bg-yellow-950/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]'}`}>{up.star > 5 ? up.star - 5 : up.star} <FaStar size={8} /></div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-0.5 whitespace-pre-wrap">{up.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .rainbow-node-circle {
          background: linear-gradient(45deg, #f43f5e, #8b5cf6, #06b6d4) !important;
          border-radius: 9999px !important;
          border: 2px solid rgba(255, 255, 255, 0.8) !important;
          animation: rainbowRotate 3s linear infinite;
        }
        @keyframes rainbowRotate { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .custom-scrollbar-visible::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar-visible::-webkit-scrollbar-thumb { background: #db2777; border-radius: 10px; }
      `}</style>
    </div>
  );
}