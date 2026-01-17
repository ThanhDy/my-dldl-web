"use client";

import { useParams } from "next/navigation";
// 1. XÓA DÒNG IMPORT FILE JSON CŨ
// import soulMastersRaw from "@/data/soulMasters.json";
import { SoulMaster, SkillDetail, SoulBone } from "@/data/types";
import { useState, useEffect } from "react"; // Thêm useEffect
import Link from "next/link";
import {
  FaArrowLeft,
  FaTimes,
  FaBone,
  FaStar,
  FaArrowUp,
  FaDna,
} from "react-icons/fa";
import { GiSpiderWeb, GiSnakeSpiral } from "react-icons/gi";
import Image from "next/image";

// 2. XÓA BIẾN DỮ LIỆU TĨNH
// const soulMastersData = soulMastersRaw as unknown as SoulMaster[];

const YEAR_LABELS: Record<string, string> = {
  y1k: "1k Năm",
  y10k: "10k Năm",
  y25k: "25k Năm",
  y50k: "50k Năm",
  y100k: "100k Năm",
};

const YEAR_ORDER = ["y1k", "y10k", "y25k", "y50k", "y100k"];

// --- COMPONENT MODAL (Giữ nguyên không đổi) ---
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

                  const formatText = (
                    text: string,
                    defaultColorClass: string
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
                            className={`font-bold ${
                              colorMap[color] || defaultColorClass
                            }`}
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
                              "text-yellow-400"
                            )}
                          </div>
                          <div className="leading-relaxed border-t border-slate-700/50 pt-2 mt-1">
                            {formatText(
                              content.split(":").slice(1).join(":").trim(),
                              "text-slate-300"
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

        {/* --- HEADER --- */}
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

        {/* --- BODY --- */}
        <div className="p-6 space-y-8">
          {isMutated ? (
            <>
              {/* Phần trên: Kỹ năng thường (Vàng) */}
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

              {/* Phần dưới: Kỹ năng suy biến (Đỏ) */}
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
                    <div className="bg-red-950/30 p-3 rounded border border-red-900/30">
                      <span className="text-red-400 font-bold mb-1 flex items-center">
                        {renderStarBadge(4, "text-red-500")}:
                      </span>
                      <p>{bone.mutation.star4Red}</p>
                    </div>
                    <div className="bg-red-950/30 p-3 rounded border border-red-900/30">
                      <span className="text-red-400 font-bold mb-1 flex items-center">
                        {renderStarBadge(5, "text-red-500")}:
                      </span>
                      <p>{bone.mutation.star5Red}</p>
                    </div>
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
                {/* 1. CƠ BẢN (Luôn có) */}
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-yellow-200 font-bold block mb-1">
                    Hiệu quả cơ bản:
                  </span>
                  <p>{bone.standard.base}</p>
                </div>

                {/* 2. DÒNG 2 SAO (Chỉ có khi Nâng cấp) */}
                {isUpgraded && bone.upgrade?.star2 && (
                  <div className="bg-slate-800/50 p-3 rounded">
                    <span className="text-yellow-400 font-bold mb-1 flex items-center">
                      {renderStarBadge(2, "text-yellow-400")}:
                    </span>
                    <p>{bone.upgrade.star2}</p>
                  </div>
                )}

                {/* 3. DÒNG 3 SAO (Chỉ có khi Nâng cấp) */}
                {isUpgraded && bone.upgrade?.star3 && (
                  <div className="bg-slate-800/50 p-3 rounded">
                    <span className="text-yellow-400 font-bold mb-1 flex items-center">
                      {renderStarBadge(3, "text-yellow-400")}:
                    </span>
                    <p>{bone.upgrade.star3}</p>
                  </div>
                )}

                {/* 4. DÒNG 4 SAO (Luôn có) */}
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-yellow-400 font-bold mb-1 flex items-center">
                    {renderStarBadge(4, "text-yellow-400")}:
                  </span>
                  <p>{bone.standard.star4}</p>
                </div>

                {/* 5. DÒNG 5 SAO (Chỉ có khi Nâng cấp) */}
                {isUpgraded && bone.upgrade?.star5 && (
                  <div className="bg-slate-800/50 p-3 rounded">
                    <span className="text-yellow-400 font-bold mb-1 flex items-center">
                      {renderStarBadge(5, "text-yellow-400")}:
                    </span>
                    <p>{bone.upgrade.star5}</p>
                  </div>
                )}

                {/* 6. DÒNG 6 SAO (Luôn có) */}
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

// --- PAGE COMPONENT CHÍNH (Đã sửa lỗi Import) ---
export default function SoulMasterDetail() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"bones" | "build">("build");
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [selectedBone, setSelectedBone] = useState<SoulBone | null>(null);

  // 3. THÊM STATE ĐỂ LƯU DỮ LIỆU TƯỚNG (THAY VÌ DÙNG JSON TĨNH)
  const [hero, setHero] = useState<SoulMaster | null>(null);
  const [loading, setLoading] = useState(true);

  // 4. THÊM USE EFFECT ĐỂ GỌI API LẤY CHI TIẾT TƯỚNG
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`/api/heroes/${params.id}`);
        if (!res.ok) throw new Error("Hero not found");
        const data = await res.json();
        setHero(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchHero();
    }
  }, [params.id]);

  // Hàm tìm skill chi tiết
  const getSkillDetail = (
    heroData: SoulMaster,
    skillIndex: number,
    typeCode: string
  ) => {
    const skillId = `${heroData.id}-s${skillIndex + 1}-${typeCode}`;
    return heroData.skillDetails?.find((s) => s.id === skillId);
  };

  // 5. HIỂN THỊ LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!hero)
    return <div className="p-10 text-white">Không tìm thấy Hồn Sư.</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20 relative">
      {/* Modal Popup */}
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
        {/* --- CỘT TRÁI (Đã xóa Stats) --- */}
        <div className="lg:col-span-1 space-y-6">
          <div
            className={`rounded-2xl overflow-hidden border-4 relative shadow-2xl ${
              hero.rarity === "SP" || hero.rarity === "SP+"
                ? "border-pink-400" // Viền SP vàng kim sáng
                : hero.rarity === "SSR"
                ? "border-yellow-500 shadow-yellow-500/20" // Viền SSR vàng
                : "border-blue-500 shadow-blue-500/20" // SR giữ nguyên
            }`}
          >
            {/* Badge Rarity */}
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

            <img
              src={hero.image}
              alt={hero.name}
              className="w-full object-cover aspect-[3/4]"
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

        {/* --- CỘT PHẢI --- */}
        <div className="lg:col-span-2">
          <div className="flex gap-4 border-b border-slate-700 mb-6">
            <button
              onClick={() => setActiveTab("build")}
              className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
                activeTab === "build"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-500"
              }`}
            >
              Hồn Hoàn
            </button>
            <button
              onClick={() => setActiveTab("bones")}
              className={`pb-3 px-4 font-bold text-sm transition border-b-2 whitespace-nowrap ${
                activeTab === "bones"
                  ? "border-yellow-500 text-yellow-400"
                  : "border-transparent text-slate-500"
              }`}
            >
              Hồn Cốt
            </button>
          </div>

          {activeTab === "build" && (
            <div className="space-y-6">
              {hero.builds?.map((build, index) => {
                // LOGIC MỚI: Tách chuỗi 4 số từ Title (Ví dụ: "PvE - 1111" -> lấy được "1111")
                const codeMatch = build.title.match(/\d{4}/);
                const codeString = codeMatch ? codeMatch[0] : "0000";
                const codes = codeString.split(""); // -> ["1", "1", "1", "1"]

                return (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                  >
                    {/* Hiển thị Title */}
                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <span className="bg-blue-500/20 px-3 py-1 rounded text-lg">
                        {build.title}
                      </span>
                    </h3>

                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide font-bold flex justify-between items-center">
                        Cấu hình Skill
                        <span className="text-[10px] font-normal normal-case italic opacity-70">
                          (Chạm để xem chi tiết)
                        </span>
                      </p>

                      <div className="flex items-center gap-4">
                        {codes.map((num, i) => {
                          // Tìm thông tin skill dựa trên vị trí (i) và mã (num)
                          const skillDetail = getSkillDetail(hero, i, num);

                          // Kiểm tra xem là hệ 1 (Rắn) hay hệ 2 (Nhện) để tô màu fallback
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
                                className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all outline-none ${
                                  !skillDetail
                                    ? "opacity-50 cursor-not-allowed grayscale"
                                    : "hover:scale-110 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
                                } ${
                                  // Màu viền fallback nếu chưa có ảnh
                                  isSpider
                                    ? "border-red-500/50"
                                    : "border-green-500/50"
                                }`}
                              >
                                {/* ƯU TIÊN 1: Nếu có iconUrl (Ảnh thật bạn upload) thì hiện ảnh */}
                                {skillDetail?.iconUrl ? (
                                  <img
                                    src={skillDetail.iconUrl}
                                    alt={skillDetail.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  // ƯU TIÊN 2: Nếu chưa có ảnh, dùng Icon mặc định + Màu nền
                                  <div
                                    className={`w-full h-full flex items-center justify-center text-2xl ${
                                      isSpider
                                        ? "bg-red-900/20 text-red-500"
                                        : "bg-green-900/20 text-green-400"
                                    }`}
                                  >
                                    {isSpider ? (
                                      <GiSpiderWeb />
                                    ) : (
                                      <GiSnakeSpiral />
                                    )}
                                  </div>
                                )}
                              </button>

                              {/* Tooltip tên skill */}
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
                      {/* Hiệu ứng nền khi hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                      {/* Icon Hồn cốt */}
                      <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-yellow-600 flex items-center justify-center text-2xl text-yellow-600 group-hover:scale-110 transition shadow-lg">
                        {bone.iconUrl ? (
                          <Image
                            src={bone.iconUrl}
                            alt={bone.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <FaBone />
                        )}
                      </div>

                      {/* Tên & Vị trí */}
                      <div className="text-center z-10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                          {bone.position}
                        </span>
                        <h4 className="text-sm font-bold text-yellow-100 group-hover:text-yellow-400 transition line-clamp-2 min-h-[2.5em]">
                          {bone.name}
                        </h4>
                      </div>

                      {/* Badge nếu có Suy Biến */}
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
