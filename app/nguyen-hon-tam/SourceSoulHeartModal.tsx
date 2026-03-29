import React from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { SourceSoulHeart } from "@/data/types";

// Hàm hỗ trợ định dạng chuỗi theo cú pháp [màu|nội dung]
const formatText = (text: string) => {
  if (!text) return null;

  // Tách chuỗi dựa trên cú pháp [color|text], ngăn chặn bắt nhầm các ngoặc vuông thông thường (ví dụ: [Ảnh Nặc])
  const parts = text.split(/(\[[^\]|]+\|[^\]]+\])/g);

  return parts.map((part, index) => {
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
        gray: "text-slate-500",
        white: "text-white",
      };
      return (
        <span
          key={index}
          className={`font-bold ${colorMap[color] || "text-slate-200"}`}
        >
          {label}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export default function SourceSoulHeartModal({
  item,
  onClose,
}: {
  item: SourceSoulHeart;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className={`bg-slate-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative border-2 shadow-2xl cursor-default no-scrollbar transition-all duration-300 ${
          item.rarity === "SP" || item.rarity === "SP+"
            ? "border-pink-400 shadow-pink-900/50"
            : item.rarity === "SSR+"
              ? "border-red-500 shadow-red-900/50"
              : item.rarity === "SSR"
                ? "border-yellow-500 shadow-yellow-500/20"
                : "border-slate-600"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full z-20 transition"
        >
          <FaTimes />
        </button>

        {/* Header Modal */}
        <div className="p-6 border-b border-slate-700 flex  gap-4 bg-slate-800/50 sticky top-0 z-10 backdrop-blur-md">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-600 shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
          </div>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-6">
          {item.basicStat && (
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 tracking-wider">
                T.Tính cơ bản
              </h4>
              <div className="text-slate-200 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 whitespace-pre-wrap leading-relaxed">
                {formatText(item.basicStat)}
              </div>
            </div>
          )}

          {item.isExtend && (
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Kế thừa Thần Cốt Thần Vị
              </h4>
              <div className="text-slate-200 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 whitespace-pre-wrap leading-relaxed">
                Người đeo có thể trang bị Hồn Cốt Thần Vị từ Hồn Sư{" "}
                <span className="text-yellow-400">
                  [{formatText(item.character)}]
                </span>
              </div>
            </div>
          )}

          {item.basicSkill && (
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Chi tiết kỹ năng
              </h4>
              <div className="text-slate-200 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 whitespace-pre-wrap leading-relaxed">
                Nguyên hồn{" "}
                <span className="text-yellow-400 font-bold">lv1</span>
                <span className="text-slate-500 font-medium">
                  /40/50/60/100
                </span>
                {"\n"}
                {formatText(item.basicSkill)}
              </div>
            </div>
          )}

          {item.starEffects && item.starEffects.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Hồn cốt Hồn Sư
              </h4>
              <div className="space-y-3 pl-4 border-l-2 border-slate-600 text-sm text-slate-300">
                {item.starEffects.map((effect, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex gap-4 items-start"
                  >
                    {/* Cột 1: Số sao */}
                    <div className="flex flex-col items-center justify-center gap-1 shrink-0 w-16 bg-slate-900/50 py-2 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span className="text-xl font-black leading-none">
                          {effect.star}
                        </span>
                        <FaStar size={14} />
                      </div>
                    </div>
                    {/* Cột 2: Hiệu ứng và Điều kiện */}
                    <div className="flex-1 py-0.5">
                      <p className="leading-relaxed text-slate-200">
                        {effect.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 italic">
                        <span className="font-semibold text-slate-400">
                          ! Nguyên hồn cấp{" "}
                          {effect.condition >= 10000
                            ? effect.condition / 10000 + " vạn"
                            : effect.condition}{" "}
                          trở lên có hiệu lực
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
