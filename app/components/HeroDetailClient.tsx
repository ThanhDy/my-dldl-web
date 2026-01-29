"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { SkillDetail, SoulBone, NvvCard, NvvCardType } from "@/data/types";
import {
  FaArrowLeft,
  FaTimes,
  FaBone,
  FaStar,
  FaBolt,
  FaDna,
  FaInfoCircle,
  FaArrowUp,
} from "react-icons/fa";
import { GiSpiderWeb, GiSnakeSpiral } from "react-icons/gi";
import BackToTop from "@/app/components/BackToTop";

const YEAR_LABELS: Record<string, string> = {
  y1k: "1k Năm",
  y10k: "10k Năm",
  y25k: "25k Năm",
  y50k: "50k Năm",
  y100k: "100k Năm",
};

const YEAR_ORDER = ["y1k", "y10k", "y25k", "y50k", "y100k"];

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

const renderStarBadge = (count: number, colorClass: string) => (
  <span className={`inline-flex items-center gap-0.5 mx-1 ${colorClass}`}>
    <span className="text-xl font-extrabold leading-none">{count}</span>
    <FaStar size={14} className="mb-0.5" />
  </span>
);

// --- KỸ NĂNG ---
function SkillModal({
  skill,
  onClose,
}: {
  skill: SkillDetail | null;
  onClose: () => void;
}) {
  if (!skill) return null;

  const SkillIcon =
    skill.soulRingType.includes("Ma Nhện") ||
    skill.soulRingType.includes("Giáp Thuẫn")
      ? GiSpiderWeb
      : GiSnakeSpiral;
  const iconColorClass =
    skill.soulRingType.includes("Ma Nhện") ||
    skill.soulRingType.includes("Giáp Thuẫn")
      ? "text-red-500 bg-red-900/20 border-red-500"
      : "text-green-500 bg-green-900/20 border-green-500";

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-slate-700 shadow-2xl cursor-default no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-700/50 rounded-full transition z-20"
        >
          <FaTimes />
        </button>

        {/* Header Modal */}
        <div className="p-6 border-b border-slate-700 flex items-center gap-4 bg-slate-800/50 sticky top-0 z-10 backdrop-blur-md">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 relative overflow-hidden ${iconColorClass}`}
          >
            {skill.iconUrl ? (
              <Image
                src={skill.iconUrl}
                alt={skill.name}
                fill
                className="object-cover"
              />
            ) : (
              <SkillIcon />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{skill.name}</h3>
            <div className="flex gap-2 mt-1 text-sm">
              <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded">
                {skill.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded ${
                  skill.soulRingType.includes("Ma Nhện")
                    ? "bg-red-600/30 text-red-300"
                    : "bg-green-600/30 text-green-300"
                }`}
              >
                {skill.soulRingType}
              </span>
            </div>
          </div>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase mb-2">
              Mô tả kỹ năng
            </h4>
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-700/30 p-4 rounded-lg border border-slate-700/50 ">
              {skill.description ? (
                skill.description
                  .split("\n")
                  .map((line: string, index: number) => (
                    <div key={index} className="min-h-[1.5em] mb-1">
                      {line === "" ? <br /> : line}
                    </div>
                  ))
              ) : (
                <span className="italic text-slate-500">Chưa có mô tả</span>
              )}
            </div>
          </div>

          {skill.yearEffects && Object.keys(skill.yearEffects).length > 0 && (
            <div>
              <div className="space-y-3 mt-4">
                {skill.yearEffects &&
                  YEAR_ORDER.map((key) => {
                    const effects = skill.yearEffects as any;
                    const desc = effects[key];
                    if (!desc) return null;

                    return (
                      <div
                        key={key}
                        className="flex gap-3 bg-slate-900/40 p-3 rounded-lg border-l-4 border-blue-500"
                      >
                        <span className="font-bold text-blue-400 whitespace-nowrap min-w-[80px]">
                          {YEAR_LABELS[key]}
                        </span>
                        <p className="text-300 text-sm leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {skill.note && skill.note.length > 0 && (
            <div className="mt-4 animate-fadeIn">
              <div className="mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">
                  Giải thích hiệu ứng
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {skill.note.map((line, index) => {
                  const content = line.trim();
                  if (!content) return null;

                  // (Giữ nguyên logic format text của bạn)
                  const formatText = (
                    text: string,
                    defaultColorClass: string,
                  ) => {
                    const parts = text.split(/(\[.*?\|.*?\])/g);
                    return parts.map((part, i) => {
                      if (part.startsWith("[") && part.endsWith("]")) {
                        const [color, label] = part.slice(1, -1).split("|");
                        const colorMap: Record<string, string> = {
                          red: "text-red-500",
                          yellow: "text-yellow-400",
                          blue: "text-blue-400",
                          green: "text-green-400",
                          purple: "text-purple-400",
                          orange: "text-orange-500",
                          cyan: "text-cyan-400",
                          white: "text-white",
                        };
                        return (
                          <span
                            key={i}
                            className={`font-bold ${colorMap[color] || defaultColorClass}`}
                          >
                            {label}
                          </span>
                        );
                      }
                      return (
                        <span key={i} className={defaultColorClass}>
                          {part}
                        </span>
                      );
                    });
                  };

                  return (
                    <div
                      key={index}
                      className="bg-slate-900/60 border border-yellow-500/10 p-4 rounded-lg text-sm shadow-sm hover:border-yellow-500/30 transition-colors group"
                    >
                      {content.includes(":") ? (
                        <>
                          <div className="mb-1 text-base block font-bold tracking-wide group-hover:text-yellow-300 transition-colors">
                            {formatText(
                              content.split(":")[0].trim(),
                              "text-yellow-400",
                            )}
                          </div>
                          <div className="leading-relaxed border-t border-slate-700/50 pt-2 mt-1">
                            {formatText(
                              content.split(":").slice(1).join(":").trim(),
                              "text-slate-300",
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="italic leading-relaxed">
                          {formatText(content, "text-yellow-400")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- HỒN CỐT ---
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
  const themeColor = isMutated ? "red" : "yellow";

  let displayIcon = bone.iconUrl;
  let displayName = bone.name;

  if (isMutated) {
    displayIcon = bone.mutation?.iconUrl || bone.iconUrl;
    displayName = `Trân∙${bone.name}`;
  } else if (isUpgraded) {
    displayIcon = bone.upgrade?.iconUrl || bone.iconUrl;
    displayName = bone.upgrade?.name || bone.name;
  }

  const borderColor =
    themeColor === "red"
      ? "border-red-600 shadow-red-900/50"
      : "border-yellow-500 shadow-yellow-500/20";
  const iconBg =
    themeColor === "red"
      ? "bg-red-900/20 border-red-500 text-red-500"
      : "bg-yellow-900/20 border-yellow-500 text-yellow-500";
  const titleColor = themeColor === "red" ? "text-red-400" : "text-yellow-400";

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className={`bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-2 shadow-2xl p-6 transition-all duration-300 ${borderColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full z-20 transition"
        >
          <FaTimes />
        </button>
        <div className="pt-8 pb-6 px-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border border-slate-600 px-2 py-1 rounded">
            Hồn Cốt {bone.position}
          </span>
          <div
            className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl mb-4 border-2 relative overflow-hidden ${isMutated ? "border-red-500 bg-red-900/20" : "border-yellow-500 bg-yellow-900/20"}`}
          >
            {bone.iconUrl ? (
              <Image src={bone.iconUrl} alt="" fill className="object-cover" />
            ) : (
              <FaBone />
            )}
          </div>
          <h2
            className={`text-2xl font-bold text-center drop-shadow-md ${titleColor}`}
          >
            {bone.name}
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs">
              Hiệu quả cơ bản
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {bone.standard?.base}
            </p>
            {bone.standard?.star4 && (
              <div className="mt-3">
                <span className="text-yellow-400 font-bold">
                  {renderStarBadge(4, "text-yellow-400")}:
                </span>{" "}
                <span className="text-slate-300 text-sm">
                  {bone.standard.star4}
                </span>
              </div>
            )}
            {bone.standard?.star6 && (
              <div className="mt-2">
                <span className="text-yellow-500 font-bold">
                  {renderStarBadge(6, "text-yellow-500")}:
                </span>{" "}
                <span className="text-slate-300 text-sm">
                  {bone.standard.star6}
                </span>
              </div>
            )}
          </div>
          {isMutated && bone.mutation ? (
            <div className="bg-red-900/10 p-4 rounded-lg border border-red-900/30 animate-fadeIn">
              <h3 className="text-red-500 font-bold uppercase mb-2 flex items-center gap-2 text-xs">
                <FaDna /> Hiệu quả Suy Biến
              </h3>
              <p className="text-red-200 text-sm mb-3 font-bold">
                {bone.mutation.name}
              </p>
              {bone.mutation.star1Red && (
                <div className="mt-1">
                  <span className="text-red-500 font-bold">
                    {renderStarBadge(1, "text-red-500")}:
                  </span>{" "}
                  <span className="text-slate-300 text-sm">
                    {bone.mutation.star1Red}
                  </span>
                </div>
              )}
              {bone.mutation.star4Red && (
                <div className="mt-1">
                  <span className="text-red-500 font-bold">
                    {renderStarBadge(4, "text-red-500")}:
                  </span>{" "}
                  <span className="text-slate-300 text-sm">
                    {bone.mutation.star4Red}
                  </span>
                </div>
              )}
              {bone.mutation.star5Red && (
                <div className="mt-1">
                  <span className="text-red-500 font-bold">
                    {renderStarBadge(5, "text-red-500")}:
                  </span>{" "}
                  <span className="text-slate-300 text-sm">
                    {bone.mutation.star5Red}
                  </span>
                </div>
              )}
              {bone.mutation.star6Red && (
                <div className="mt-2">
                  <span className="text-red-500 font-bold">
                    {renderStarBadge(6, "text-red-500")}:
                  </span>{" "}
                  <span className="text-slate-300 text-sm">
                    {bone.mutation.star6Red}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* ... (Giữ nguyên logic non-mutated) ... */}
              <div className="flex items-center gap-2 border-b border-yellow-500/30 pb-2">
                {isUpgraded ? (
                  <FaArrowUp className="text-yellow-400" />
                ) : (
                  <FaStar className="text-yellow-500" />
                )}
                <h3 className="text-lg font-bold text-yellow-500 uppercase">
                  {isUpgraded ? "Hiệu Quả Nâng Cấp" : "Kỹ Năng Huyễn Hoá"}
                </h3>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-yellow-500 font-bold mb-1 flex items-center">
                    {renderStarBadge(2, "text-yellow-500")}:
                  </span>
                  <p>{bone.upgrade?.star2}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-yellow-500 font-bold mb-1 flex items-center">
                    {renderStarBadge(3, "text-yellow-500")}:
                  </span>
                  <span>{bone.upgrade?.star3}</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-yellow-500 font-bold mb-1 flex items-center">
                    {renderStarBadge(5, "text-yellow-500")}:
                  </span>
                  <p>{bone.upgrade?.star5}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- CHI TIẾT THẺ BÀI ---
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
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <FaTimes />
        </button>
        <div className="w-full md:w-[45%] shrink-0 relative bg-slate-950 p-8 flex items-center justify-center border-r border-slate-800">
          <div className="w-full max-w-[240px] rounded-xl overflow-hidden border-2 border-pink-400 relative aspect-[3/4] shadow-2xl">
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute top-0 inset-x-0 pt-4 flex justify-center z-20">
              <h3 className="text-sm font-bold text-white text-center bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full shadow-lg mx-2 truncate max-w-full">
                {card.name}
              </h3>
            </div>
            <div className="absolute top-14 right-2 z-20">
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-md border ${
                  card.type === "Thông Dụng"
                    ? "bg-slate-700 text-slate-300 border-slate-500"
                    : "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400/50"
                }`}
              >
                {card.type === "Thông Dụng" ? "Thông Dụng" : "Chuyên Dụng"}
              </span>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-16 flex items-end justify-center">
              <p className="text-slate-300 text-[12px] italic text-center line-clamp-3 leading-relaxed opacity-90 group-hover:text-white transition-colors">
                {card.shortDescription}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[55%] bg-slate-900/50 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
            <h4 className="text-pink-400 font-bold text-sm uppercase mb-3 flex items-center gap-2">
              <FaBolt /> Kỹ Năng Cơ Bản
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {card.basicSkill}
            </p>
          </div>
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-colors">
            <h4 className="text-blue-400 font-bold text-sm uppercase flex items-center gap-2 mb-3 border-b border-blue-500/10 pb-2">
              <FaInfoCircle /> Hiệu Ứng Chi Tiết
            </h4>

            {isQuestCard ? (
              <div className="space-y-4 relative z-10">
                <div className="flex gap-3 items-start">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      Nhiệm vụ Thí Luyện
                    </p>
                    <div className="text-blue-100 border-l-2 border-blue-500 pl-4 py-1 leading-relaxed bg-blue-900/10 rounded-r">
                      {card.detailedEffect.quest?.description}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 items-start rounded-lg ">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      Phần thưởng Thí Luyện
                    </p>
                    <div className="text-blue-100 border-l-2 border-blue-500 pl-4 py-1 leading-relaxed bg-blue-900/10 rounded-r">
                      {card.detailedEffect.quest?.buff}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm space-y-4">
                <div>
                  <p className="text-slate-400 italic bg-black/20 px-3 py-1.5 rounded inline-block border border-slate-700">
                    {card.detailedEffect.condition}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                    Hiệu quả
                  </p>
                  <div className="text-blue-100 border-l-2 border-blue-500 pl-4 py-1 leading-relaxed bg-blue-900/10 rounded-r">
                    {card.detailedEffect.effect}
                  </div>
                </div>
              </div>
            )}
          </div>
          {card.upgradeEffect && (
            <div className="bg-gradient-to-br from-purple-900/10 to-slate-800/50 p-5 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors">
              <h4 className="text-purple-400 font-bold text-sm uppercase flex items-center gap-2 mb-3 border-b border-purple-500/10 pb-2">
                Hiệu Ứng Nâng Cấp
              </h4>
              <div className="text-sm space-y-3">
                <div>
                  <p className="text-slate-400 italic bg-black/20 px-3 py-1.5 rounded inline-block border border-slate-700">
                    {card.detailedEffect.condition}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                    Hiệu quả mới
                  </p>
                  <div className="text-blue-100 border-l-2 border-blue-500 pl-4 py-1 leading-relaxed bg-blue-900/10 rounded-r">
                    {card.upgradeEffect.effect}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function HeroDetailClient({ hero }: { hero: any }) {
  if (!hero)
    return (
      <div className="p-10 text-white text-center min-h-screen bg-slate-950">
        Đang tải dữ liệu...
      </div>
    );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [selectedBone, setSelectedBone] = useState<SoulBone | null>(null);
  const [selectedCard, setSelectedCard] = useState<NvvCard | null>(null);
  const [activeFilter, setActiveFilter] = useState<"Tất Cả" | NvvCardType>(
    "Tất Cả",
  );

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

  if (!mounted || !hero)
    return (
      <div className="p-10 text-white text-center min-h-screen bg-slate-950 font-bold uppercase tracking-widest">
        ĐANG TẢI...
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

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 relative font-sans selection:bg-pink-500/30">
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
      {selectedBone && (
        <SoulBoneModal
          bone={selectedBone}
          onClose={() => setSelectedBone(null)}
        />
      )}
      {selectedCard && (
        <NvvCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      <div className="p-6 max-w-6xl mx-auto">
        <Link
          href="/soul-masters"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <FaArrowLeft /> Quay lại kho tướng
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
        {/* CỘT TRÁI - VIỀN CẦU VỒNG SP & VIỀN ĐỎ SSR+ */}
        <div className="lg:col-span-1 space-y-6">
          <div
            className={`rounded-2xl overflow-hidden relative shadow-2xl aspect-[3/4] w-full ${
              isRainbowRarity
                ? "bg-gradient-to-b from-pink-400 via-purple-400 to-cyan-400 p-[4px]" // Bỏ border-transparent, chỉ dùng padding làm viền
                : hero.rarity === "SSR+"
                  ? "border-4 border-red-600 shadow-red-600/30" // Thêm border-4 vào đây
                  : "border-4 border-yellow-500 shadow-yellow-500/20" // Thêm border-4 vào đây
            }`}
          >
            <div className="relative w-full h-full bg-slate-900 rounded-[12px] overflow-hidden">
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`px-3 py-1 rounded font-bold text-sm ${
                    isRainbowRarity
                      ? "border-transparent bg-gradient-to-tr from-rose-400 via-fuchsia-500 via-indigo-500 to-cyan-400 p-[4px] shadow-fuchsia-500/20"
                      : isSsrPlus
                        ? "border-red-600 shadow-red-600/30"
                        : "border-yellow-500 shadow-yellow-500/20"
                  }`}
                >
                  {hero.rarity}
                </span>
              </div>
              <Image
                src={hero.image}
                alt={hero.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                <p className="text-yellow-400 font-medium text-sm tracking-wider mb-1">
                  {hero.title}
                </p>
                <h1 className="text-2xl font-black uppercase tracking-tight italic">
                  {hero.name}
                </h1>
                <div className="flex gap-2 mt-2">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    {hero.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* TAB NAVIGATION */}
          <div className="flex gap-4 border-b border-slate-800 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {isAmKhi ? (
              <>
                <button
                  onClick={() => setActiveTab("stars")}
                  className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "stars" ? "border-red-500 text-red-500" : "border-transparent text-slate-500"}`}
                >
                  Nâng Sao
                </button>
              </>
            ) : (
              <>
                {!hasSkillGrid && (
                  <button
                    onClick={() => setActiveTab("build")}
                    className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "build" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}
                  >
                    Hồn Hoàn
                  </button>
                )}
                {hasSkillGrid && (
                  <button
                    onClick={() => setActiveTab("skills")}
                    className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "skills" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}
                  >
                    Kỹ Năng
                  </button>
                )}
              </>
            )}
            {isTranTam && (
              <button
                onClick={() => setActiveTab("thien_phu")}
                className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "thien_phu" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-500"}`}
              >
                Thiên Phú
              </button>
            )}
            {isVinhVinh && hero.nvvCardSystem && (
              <button
                onClick={() => setActiveTab("nvv_cards")}
                className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "nvv_cards" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-500"}`}
              >
                Thẻ Bài
              </button>
            )}
            <button
              onClick={() => setActiveTab("bones")}
              className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "bones" ? "border-yellow-500 text-yellow-400" : "border-transparent text-slate-500"}`}
            >
              Hồn Cốt
            </button>
          </div>

          <div className="mt-4">
            {/* NÂNG SAO & HIỆU ỨNG MẶC ĐỊNH */}
            {activeTab === "build" && !hasSkillGrid && !isAmKhi && (
              <div className="space-y-4 animate-fadeIn">
                {hero.builds?.map((build: any, idx: number) => {
                  const codes = build.title.match(/\d{4}/)?.[0].split("") || [
                    "1",
                    "1",
                    "1",
                    "1",
                  ];
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/50 shadow-lg"
                    >
                      <h4 className="text-[14px] font-black uppercase text-blue-500 tracking-[0.2em] mb-4">
                        {build.title}
                      </h4>
                      <div className="flex gap-4">
                        {codes.map((num: string, i: number) => {
                          const skill = getSkillDetail(hero, i, num);
                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-3 cursor-pointer group"
                              onClick={() => skill && setSelectedSkill(skill)}
                            >
                              <div
                                className={`w-16 h-16 rounded-full border-2 p-0.5 transition-transform group-hover:scale-110 ${num === "1" ? "border-green-600 bg-green-950/20" : "border-red-600 bg-red-950/20"}`}
                              >
                                {skill?.iconUrl ? (
                                  <div className="w-full h-full relative rounded-full overflow-hidden">
                                    <Image
                                      src={skill.iconUrl}
                                      alt=""
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-xs font-bold flex items-center justify-center h-full bg-slate-800 rounded-full">
                                    {num}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-500 uppercase">
                                Skill {i + 1}
                              </span>
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
                  <div
                    key={index}
                    className="flex flex-col items-center gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800 hover:border-blue-500 transition cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 relative overflow-hidden shadow-md">
                      {skill.iconUrl ? (
                        <Image
                          src={skill.iconUrl}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xl font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-center text-slate-200 truncate w-full px-1">
                      {skill.name}
                    </p>
                  </div>
                ))}
              </div>
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

            {/* THẺ BÀI VINH VINH */}
            {activeTab === "nvv_cards" && isVinhVinh && hero.nvvCardSystem && (
              <div className="space-y-6 animate-fadeIn">
                <div className="pb-4 overflow-x-auto custom-scrollbar-visible">
                  <div className="flex gap-2 min-w-max pr-4">
                    {filters.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${activeFilter === f ? "bg-pink-600 text-white border-pink-500" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredCards?.map((card: any) => (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="cursor-pointer group relative rounded-xl overflow-hidden border-2 border-pink-500/50 aspect-[3/4]"
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-pink-600 text-white text-[9px] px-2 py-0.5 rounded uppercase font-bold">
                          {card.type === "Thông Dụng"
                            ? "Thông Dụng"
                            : "Chuyên Dụng"}
                        </span>
                      </div>
                      <Image
                        src={card.image}
                        alt={card.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black p-3 pt-10">
                        <h4 className="text-[10px] font-bold text-white truncate group-hover:text-pink-400 transition-colors">
                          {card.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KỸ NĂNG CHI TIẾT (SP+) */}
            {activeTab === "bones" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-fadeIn">
                {hero.soulBones
                  ?.filter((bone: any) => bone.name && bone.name.trim() !== "")
                  ?.map((bone: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => setSelectedBone(bone)}
                      className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-yellow-600 transition-all group shadow-md"
                    >
                      <div
                        className={`w-14 h-14 rounded bg-black/40 border flex items-center justify-center shrink-0 ${bone.mutation?.name ? "border-red-600/30" : "border-yellow-600/30"}`}
                      >
                        {bone.iconUrl ? (
                          <Image
                            src={bone.iconUrl}
                            alt=""
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        ) : (
                          <FaBone className="text-slate-700 text-xl" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-500 uppercase truncate">
                          {bone.position}
                        </p>
                        <h4
                          className={`text-xs font-bold truncate transition-colors ${bone.mutation?.name ? "text-red-400 group-hover:text-red-500" : "text-slate-200 group-hover:text-yellow-500"}`}
                        >
                          {bone.name}
                        </h4>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* HỒN CỐT */}
            {activeTab === "stars" && isAmKhi && (
              <div className="space-y-4 animate-fadeIn">
                {hero.amKhiNote && (
                  <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl flex gap-3 text-xs italic text-red-200 shadow-inner">
                    <FaInfoCircle className="shrink-0 mt-0.5" />{" "}
                    <p>{hero.amKhiNote}</p>
                  </div>
                )}
                {hero.starUpgrades?.map((up: any, i: number) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex gap-4 items-start shadow-lg hover:border-red-500/30 transition-all"
                  >
                    <div
                      className={`px-2 py-1 rounded border font-bold text-[14px] flex items-center gap-1 shrink-0 ${up.isRedStar ? "border-red-500 text-red-500 bg-red-950/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "border-yellow-500 text-yellow-500 bg-yellow-950/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]"}`}
                    >
                      {up.star > 5 ? up.star - 5 : up.star} <FaStar size={8} />
                    </div>
                    <p className="text-[14px] text-slate-300 leading-relaxed pt-0.5 whitespace-pre-wrap">
                      {up.description}
                    </p>
                  </div>
                ))}
              </div>
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
