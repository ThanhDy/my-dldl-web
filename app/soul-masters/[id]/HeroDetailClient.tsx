"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// Đảm bảo bạn đã cập nhật file types.ts để có NvvCard, NvvCardType
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
  FaArrowUp,
  FaDna,
  // Icon mới cho Thẻ Bài
  FaBolt,
  FaInfoCircle,
} from "react-icons/fa";
import { GiSpiderWeb, GiSnakeSpiral } from "react-icons/gi";

const YEAR_LABELS: Record<string, string> = {
  y1k: "1k Năm",
  y10k: "10k Năm",
  y25k: "25k Năm",
  y50k: "50k Năm",
  y100k: "100k Năm",
};

const YEAR_ORDER = ["y1k", "y10k", "y25k", "y50k", "y100k"];

// --- 1. MODAL SKILL (GIỮ NGUYÊN) ---
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

// --- 2. MODAL HỒN CỐT (GIỮ NGUYÊN) ---
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
        className={`bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-2 shadow-2xl cursor-default no-scrollbar transition-all duration-300 ${borderColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full z-20 transition"
        >
          <FaTimes />
        </button>

        <div className="pt-8 pb-6 px-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 border border-slate-600 px-2 py-1 rounded">
            Hồn Cốt {bone.position}
          </span>
          <div
            className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-2xl relative overflow-hidden border-2 transition-colors duration-300 ${iconBg}`}
          >
            {displayIcon ? (
              <Image
                src={displayIcon}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <FaBone />
            )}
          </div>
          <h2
            className={`text-2xl font-bold text-center transition-colors duration-300 ${titleColor} drop-shadow-md`}
          >
            {displayName}
          </h2>
        </div>

        <div className="p-6 space-y-8">
          {isMutated ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-yellow-500/30 pb-2">
                  <FaStar className="text-yellow-500" />
                  <h3 className="text-lg font-bold text-yellow-500 uppercase">
                    Kỹ Năng Huyễn Hoá
                  </h3>
                </div>
                <div className="space-y-3 pl-4 border-l-2 border-yellow-500/20 text-sm text-slate-300">
                  <div className="bg-slate-800/50 p-3 rounded">
                    <span className="text-yellow-200 font-bold block mb-1">
                      Hiệu quả cơ bản:
                    </span>
                    <p>{bone.standard.base}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded">
                    <span className="text-yellow-400 font-bold mb-1 flex items-center">
                      {renderStarBadge(4, "text-yellow-400")}:
                    </span>
                    <p>{bone.standard.star4}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded">
                    <span className="text-yellow-500 font-bold mb-1 flex items-center">
                      {renderStarBadge(6, "text-yellow-500")}:
                    </span>
                    <p>{bone.standard.star6}</p>
                  </div>
                </div>
              </div>
              {bone.mutation && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 border-b border-red-500/30 pb-2 mt-2">
                    <FaDna className="text-red-500" />
                    <h3 className="text-lg font-bold text-red-500 uppercase">
                      Hiệu Quả Tiến Hoá
                    </h3>
                  </div>
                  <div className="space-y-3 pl-4 border-l-2 border-red-500/20 text-sm text-slate-300">
                    <div className="bg-red-950/30 p-3 rounded border border-red-900/30">
                      <span className="text-red-400 font-bold mb-1 flex items-center">
                        {renderStarBadge(1, "text-red-500")}:
                      </span>
                      <p>{bone.mutation.star1Red}</p>
                    </div>
                    {/* ... (Giữ nguyên các sao đỏ khác) ... */}
                    <div className="bg-red-950/30 p-3 rounded border border-red-900/30">
                      <span className="text-red-400 font-bold mb-1 flex items-center">
                        {renderStarBadge(6, "text-red-500")}:
                      </span>
                      <p>{bone.mutation.star6Red}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
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
              <div className="space-y-3 pl-4 border-l-2 border-yellow-500/20 text-sm text-slate-300">
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-yellow-200 font-bold block mb-1">
                    Hiệu quả cơ bản:
                  </span>
                  <p>{bone.standard.base}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-yellow-500 font-bold mb-1 flex items-center">
                    {renderStarBadge(6, "text-yellow-500")}:
                  </span>
                  <p>{bone.standard.star6}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const renderStarBadge = (count: number, colorClass: string) => (
  <span className={`inline-flex items-center gap-0.5 mx-1 ${colorClass}`}>
    <span className="text-xl font-extrabold leading-none">{count}</span>
    <FaStar size={14} className="mb-0.5" />
  </span>
);

// --- COMPONENT: MODAL CHI TIẾT THẺ BÀI NVV (LAYOUT 2 CỘT) ---
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
        // 1. SỬA: max-w-6xl -> max-w-3xl (Modal nhỏ gọn lại)
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[600px] flex md:flex-row overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-slate-700"
        >
          <FaTimes />
        </button>

        {/* --- CỘT TRÁI: TĂNG KÍCH THƯỚC --- */}
        {/* 2. SỬA: md:w-[45%] -> md:w-[60%] (Chiếm 60% chiều ngang) */}
        <div className="w-full md:w-[50%] shrink-0 relative bg-slate-950 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-800">
          {/* Card Avatar (Giữ nguyên size nhỏ 160px) */}
          <div
            className={`w-full max-w-[240px] rounded-xl overflow-hidden border-2 relative shadow-2xl aspect-[3/4] group ${
              card.type === "Thông Dụng"
                ? "border-slate-500 shadow-slate-500/20"
                : "border-pink-400 shadow-pink-500/20"
            }`}
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              priority
              className="object-cover transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 250px"
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
              <p className="text-slate-300 text-[10px] italic text-center line-clamp-3 leading-relaxed opacity-90 group-hover:text-white transition-colors">
                {card.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: GIẢM KÍCH THƯỚC --- */}
        {/* 3. SỬA: bỏ basis-full, sửa md:w-[55%] -> md:w-[40%] (Chiếm 40% còn lại) */}
        <div className="w-full md:w-[60%] bg-slate-900/50 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="space-y-6">
            {/* Kỹ năng cơ bản */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
              <h4 className="text-pink-400 font-bold text-sm uppercase flex items-center gap-2 mb-3 border-b border-pink-500/10 pb-2">
                <FaBolt /> Kỹ Năng Cơ Bản
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {card.basicSkill}
              </p>
            </div>

            {/* Hiệu Ứng Chi Tiết */}
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
                  <div className="flex gap-3 items-start rounded-lg">
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

            {/* Hiệu ứng nâng cấp */}
            {card.upgradeEffect && (
              <div className="bg-gradient-to-br from-purple-900/10 to-slate-800/50 p-5 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors">
                <h4 className="text-purple-400 font-bold text-sm uppercase flex items-center gap-2 mb-3 border-b border-purple-500/10 pb-2">
                  <FaArrowUp /> Hiệu Ứng Nâng Cấp
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
    </div>
  );
};

// --- 4. [MỚI] COMPONENT: HỆ THỐNG THẺ BÀI (GRID & FILTER) ---
const NvvCardSystem = ({ cards }: { cards: NvvCard[] }) => {
  const filters: ("Tất Cả" | NvvCardType)[] = [
    "Tất Cả",
    "Thông Dụng",
    "Cửu Thải Lưu Ly · Tốc",
    "Lưu Ly Tâm Nguyên",
    "Cửu Thải Lưu Ly · Dụ",
    "Cửu Thải Lưu Ly · Diệu",
  ];
  const [activeFilter, setActiveFilter] = useState<"Tất Cả" | NvvCardType>(
    "Tất Cả",
  );
  const [selectedCard, setSelectedCard] = useState<NvvCard | null>(null);
  const filteredCards =
    activeFilter === "Tất Cả"
      ? cards
      : cards.filter((c) => c.type === activeFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {selectedCard && (
        <NvvCardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
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
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
          Chưa có thẻ bài nào.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="cursor-pointer group"
            >
              {/* ÁP DỤNG STYLE AVATAR CHO DANH SÁCH BÊN NGOÀI */}
              <div
                className={`rounded-xl overflow-hidden border-2 relative shadow-lg aspect-[3/4] transition-transform hover:-translate-y-1 ${
                  card.type === "Thông Dụng"
                    ? "border-slate-600"
                    : "border-pink-500/50"
                }`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${"bg-gradient-to-b from-pink-400 to-purple-500 text-white"}`}
                  >
                    {card.type === "Thông Dụng" ? "Thông Dụng" : "Chuyên Dụng"}
                  </span>
                </div>
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Gradient & Text Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-12">
                  <h4 className="font-bold text-[10px] text-white truncate group-hover:text-pink-400 transition-colors">
                    {card.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {card.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 5. MAIN COMPONENT ---
export default function HeroDetailClient({ hero }: { hero: SoulMaster }) {
  const isSpPlus = hero.isSpPlus === true;

  // Logic: Nếu SP+ -> ưu tiên tab skills, Nếu thường -> build
  const [activeTab, setActiveTab] = useState<string>(
    isSpPlus ? "skills" : "build",
  );
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [selectedBone, setSelectedBone] = useState<SoulBone | null>(null);

  const getSkillDetail = (
    heroData: SoulMaster,
    skillIndex: number,
    typeCode: string,
  ) => {
    const skillId = `${heroData.id}-s${skillIndex + 1}-${typeCode}`;
    return heroData.skillDetails?.find((s) => s.id === skillId);
  };

  if (!hero)
    return <div className="p-10 text-white">Không tìm thấy Hồn Sư.</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20 relative font-sans selection:bg-pink-500/30">
      {/* Modal Popup (Dùng chung cho cả SP+ và thường) */}
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

      <div className="p-6 max-w-6xl mx-auto">
        <Link
          href="/soul-masters"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <FaArrowLeft /> Quay lại kho tướng
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
        {/* CỘT TRÁI: ẢNH & INFO */}
        <div className="lg:col-span-1 space-y-6">
          <div
            className={`rounded-2xl overflow-hidden border-4 relative shadow-2xl aspect-[3/4] ${
              hero.rarity === "SP" || hero.rarity === "SP+"
                ? "border-pink-400"
                : hero.rarity === "SSR"
                  ? "border-yellow-500 shadow-yellow-500/20"
                  : "border-blue-500 shadow-blue-500/20"
            }`}
          >
            <div className="absolute top-4 left-4 z-10">
              <span
                className={`px-3 py-1 rounded font-bold text-sm ${
                  hero.rarity === "SP" || hero.rarity === "SP+"
                    ? "bg-gradient-to-b from-pink-400 via-purple-400 to-cyan-400 text-white border-yellow-200/50"
                    : hero.rarity === "SSR"
                      ? "bg-yellow-500 text-white border-yellow-600"
                      : "bg-purple-600 text-white border-purple-800"
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
              <p className="text-yellow-400 font-medium text-sm tracking-wider mb-1">
                {hero.title}
              </p>
              <h1 className="text-3xl font-bold">{hero.name}</h1>
              <div className="flex gap-2 mt-2">
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                  {hero.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-2">
          {/* TAB NAVIGATION */}
          <div className="flex gap-4 border-b border-slate-700 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {/* SP+ hiện "Kỹ Năng", Thường hiện "Hồn Hoàn" */}
            {isSpPlus ? (
              <button
                onClick={() => setActiveTab("skills")}
                className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "skills" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-500"}`}
              >
                Kỹ Năng
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("build")}
                className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === "build" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}
              >
                Hồn Hoàn
              </button>
            )}

            {/* TAB THẺ BÀI (NVV) */}
            {hero.nvvCardSystem && (
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

          {/* --- RENDER CONTENT --- */}

          {/* 1. CONTENT KỸ NĂNG (SP+ ONLY) - ICON TRÒN GIỐNG HỆ CŨ NHƯNG KHÔNG CHIA NHÁNH */}
          {activeTab === "skills" && isSpPlus && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide font-bold flex justify-between items-center">
                    Danh sách kỹ năng{" "}
                    <span className="text-[10px] font-normal normal-case italic opacity-70">
                      (Chạm để xem chi tiết)
                    </span>
                  </p>

                  <div className="flex items-center gap-4">
                    {hero.skillDetails?.map((skill, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2 group relative"
                      >
                        <button
                          onClick={() => setSelectedSkill(skill)}
                          className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all outline-none relative hover:scale-110 cursor-pointer hover:shadow-lg"
                        >
                          {skill.iconUrl ? (
                            <Image
                              src={skill.iconUrl}
                              alt={skill.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            // Fallback: Hiện số 1, 2, 3, 4 nếu chưa có ảnh
                            <div className="text-xl font-bold">{index + 1}</div>
                          )}
                        </button>

                        {/* Tooltip tên skill */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-20 border border-pink-500/30">
                          {skill.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CONTENT THẺ BÀI (NVV ONLY) */}
          {activeTab === "nvv_cards" && hero.nvvCardSystem && (
            <NvvCardSystem cards={hero.nvvCardSystem.cards} />
          )}

          {/* 3. CONTENT HỒN HOÀN (TƯỚNG THƯỜNG - GIỮ NGUYÊN) */}
          {activeTab === "build" && !isSpPlus && (
            <div className="space-y-6">
              {hero.builds?.map((build, index) => {
                const codeMatch = build.title.match(/\d{4}/);
                const codeString = codeMatch ? codeMatch[0] : "0000";
                const codes = codeString.split("");

                return (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                  >
                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <span className="bg-blue-500/20 px-3 py-1 rounded text-lg">
                        {build.title}
                      </span>
                    </h3>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide font-bold flex justify-between items-center">
                        Cấu hình Skill{" "}
                        <span className="text-[10px] font-normal normal-case italic opacity-70">
                          (Chạm để xem chi tiết)
                        </span>
                      </p>
                      <div className="flex items-center gap-4">
                        {codes.map((num, i) => {
                          const skillDetail = getSkillDetail(hero, i, num);
                          const isSpider = num === "2";
                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-2 group relative"
                            >
                              <button
                                onClick={() =>
                                  skillDetail && setSelectedSkill(skillDetail)
                                }
                                disabled={!skillDetail}
                                className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all outline-none relative ${!skillDetail ? "opacity-50 cursor-not-allowed grayscale" : "hover:scale-110 cursor-pointer hover:shadow-lg"} ${isSpider ? "border-red-500/50" : "border-green-500/50"}`}
                              >
                                {skillDetail?.iconUrl ? (
                                  <Image
                                    src={skillDetail.iconUrl}
                                    alt={skillDetail.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                ) : (
                                  <div
                                    className={`w-full h-full flex items-center justify-center text-2xl ${isSpider ? "bg-red-900/20 text-red-500" : "bg-green-900/20 text-green-400"}`}
                                  >
                                    {isSpider ? (
                                      <GiSpiderWeb />
                                    ) : (
                                      <GiSnakeSpiral />
                                    )}
                                  </div>
                                )}
                              </button>
                              {skillDetail && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-20">
                                  {skillDetail.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. CONTENT HỒN CỐT (CHUNG - GIỮ NGUYÊN) */}
          {activeTab === "bones" && (
            <div className="space-y-6 animate-fadeIn">
              {!hero.soulBones || hero.soulBones.length === 0 ? (
                <div className="text-slate-500 italic">
                  Chưa có dữ liệu hồn cốt cho tướng này.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hero.soulBones.map((bone, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedBone(bone)}
                      className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-yellow-500 hover:bg-slate-800/80 transition group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                      <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-yellow-600 flex items-center justify-center text-2xl text-yellow-600 group-hover:scale-110 transition shadow-lg relative">
                        {bone.iconUrl ? (
                          <Image
                            src={bone.iconUrl}
                            alt={bone.name}
                            fill
                            className="object-cover rounded-full"
                            sizes="64px"
                          />
                        ) : (
                          <FaBone />
                        )}
                      </div>
                      <div className="text-center z-10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                          {bone.position}
                        </span>
                        <h4 className="text-sm font-bold text-yellow-100 group-hover:text-yellow-400 transition line-clamp-2 min-h-[2.5em]">
                          {bone.name}
                        </h4>
                      </div>
                      {bone.mutation && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
