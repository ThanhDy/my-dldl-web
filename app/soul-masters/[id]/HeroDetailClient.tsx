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

const renderStarBadge = (count: number, colorClass: string) => (
  <span className={`inline-flex items-center gap-0.5 mx-1 ${colorClass}`}>
    <span className="text-xl font-extrabold leading-none">{count}</span>
    <FaStar size={14} className="mb-0.5" />
  </span>
);

const formatText = (text: string, defaultColorClass: string) => {
  if (!text) return null;
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

  const isMutated = !!bone.mutation;
  const isUpgraded = !!bone.upgrade;
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
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {card.detailedEffect.quest?.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start rounded-lg ">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      Phần thưởng Thí Luyện
                    </p>
                    <p className="text-sm leading-relaxed">
                      {card.detailedEffect.quest?.buff}
                    </p>
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

  const isSpPlus = hero.rarity === "SP" || hero.rarity === "SP+";
  const isAmKhi = hero.type === "Ám Khí";
  // KHÓA CHẶT ĐIỀU KIỆN VINH VINH
  const isVinhVinh = hero.name?.toLowerCase().includes("vinh vinh");

  const [activeTab, setActiveTab] = useState<string>(
    isAmKhi ? "stars" : isSpPlus ? "skills" : "build",
  );
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [selectedBone, setSelectedBone] = useState<SoulBone | null>(null);
  const [selectedCard, setSelectedCard] = useState<NvvCard | null>(null);
  const [activeFilter, setActiveFilter] = useState<"Tất Cả" | NvvCardType>(
    "Tất Cả",
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
              isSpPlus
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
                    isSpPlus
                      ? "bg-gradient-to-b from-pink-400 via-purple-400 to-cyan-400 text-white border border-yellow-200/50"
                      : hero.rarity === "SSR+"
                        ? "bg-red-600 text-white border border-red-400"
                        : "bg-yellow-500 text-black border-yellow-600"
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
                <h1 className="text-2xl font-black uppercase tracking-tight">
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
                <button
                  onClick={() => setActiveTab("bones")}
                  className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "bones" ? "border-yellow-500 text-yellow-400" : "border-transparent text-slate-500"}`}
                >
                  Hồn Cốt
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab(isSpPlus ? "skills" : "build")}
                  className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "skills" || activeTab === "build" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}
                >
                  {isSpPlus ? "Kỹ Năng" : "Hồn Hoàn"}
                </button>
                {/* CHỈ HIỆN THẺ BÀI CHO VINH VINH */}
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
              </>
            )}
          </div>

          <div className="mt-4">
            {/* NÂNG SAO & HIỆU ỨNG MẶC ĐỊNH */}
            {activeTab === "stars" && isAmKhi && (
              <div className="space-y-6 animate-fadeIn">
                {/* HIỆU ỨNG MẶC ĐỊNH */}
                {hero.amKhiNote && (
                  <div className="bg-red-950/20 border border-red-900/50 p-5 rounded-2xl flex gap-4 items-start shadow-inner">
                    <div className="p-2 bg-red-600/20 rounded-lg text-red-500 shrink-0 border border-red-600/30">
                      <FaInfoCircle size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-red-400 font-black text-xs uppercase tracking-widest border-b border-red-900/50 pb-1 mb-2">
                        Hiệu ứng mặc định
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {hero.amKhiNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* DANH SÁCH NÂNG SAO */}
                <div className="space-y-4">
                  {hero.starUpgrades?.map((up: any, i: number) => (
                    <div
                      key={i}
                      className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex gap-5 items-start hover:border-red-500/30 transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 shrink-0 rounded-full border-2 flex flex-col items-center justify-center font-bold ${up.isRedStar ? "border-red-500 text-red-500 bg-red-950/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "border-yellow-500 text-yellow-500 bg-yellow-950/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]"}`}
                      >
                        <span className="text-xl leading-none">
                          {up.star > 5 ? up.star - 5 : up.star}
                        </span>
                        <FaStar size={10} />
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed pt-1 whitespace-pre-wrap">
                        {up.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BUILD PVE/PVP */}
            {!isAmKhi && (activeTab === "build" || activeTab === "skills") && (
              <div className="space-y-6 animate-fadeIn mb-10">
                {hero.builds?.map((build: any, index: number) => {
                  const codes = build.title.match(/\d{4}/)?.[0].split("") || [
                    "1",
                    "1",
                    "1",
                    "1",
                  ];
                  return (
                    <div
                      key={index}
                      className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 shadow-xl"
                    >
                      <h3 className="text-lg font-bold text-blue-400 mb-6 flex items-center gap-3">
                        <span className="bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30 font-mono tracking-widest">
                          {build.title}
                        </span>
                      </h3>
                      <div className="flex justify-around items-center gap-4">
                        {codes.map((num: string, i: number) => {
                          const skillDetail = getSkillDetail(hero, i, num);
                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-3 group cursor-pointer"
                              onClick={() =>
                                skillDetail && setSelectedSkill(skillDetail)
                              }
                            >
                              <div
                                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all group-hover:scale-110 ${num === "1" ? "border-green-500 bg-green-950/20" : "border-red-500 bg-red-950/20"}`}
                              >
                                {skillDetail?.iconUrl ? (
                                  <div className="relative w-full h-full">
                                    <Image
                                      src={skillDetail.iconUrl}
                                      alt=""
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-xl font-black">
                                    {num}
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
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

            {/* THẺ BÀI VINH VINH */}
            {activeTab === "nvv_cards" && isVinhVinh && hero.nvvCardSystem && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${activeFilter === filter ? "bg-slate-700 text-white border-slate-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            {activeTab === "skills" && isSpPlus && !isAmKhi && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn mt-8 pt-8 border-t border-slate-800">
                <div className="col-span-full mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-pink-500 rounded-full"></span>
                  <h2 className="text-lg font-bold text-slate-100 uppercase">
                    Tất cả kỹ năng chi tiết
                  </h2>
                </div>
                {hero.skillDetails?.map((skill: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800 hover:border-pink-500 transition cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-pink-500/30 relative overflow-hidden shadow-lg shrink-0">
                      {skill.iconUrl ? (
                        <Image
                          src={skill.iconUrl}
                          alt={skill.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xl font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-center text-slate-200 truncate w-full">
                      {skill.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* HỒN CỐT */}
            {activeTab === "bones" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
                {hero.soulBones?.map((bone: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedBone(bone)}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-yellow-500 transition group relative"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-yellow-600 flex items-center justify-center text-2xl text-yellow-600 relative overflow-hidden shrink-0">
                      {bone.iconUrl ? (
                        <Image
                          src={bone.iconUrl}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FaBone />
                      )}
                    </div>
                    <div className="text-center w-full">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        {bone.position}
                      </span>
                      <h4 className="text-sm font-bold text-yellow-100 group-hover:text-yellow-400 transition line-clamp-1">
                        {bone.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
