"use client";

import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface MutationEffect {
  starLevel: string;
  type?: "red" | "gold";
  effect: string;
}

interface MutationPanelProps {
  type: "red" | "gold";
  title: string;
  icon: React.ReactNode;
  effects: MutationEffect[];
  onAdd: () => void;
  onUpdate: (realIdx: number, field: string, value: any) => void;
  onRemove: (realIdx: number) => void;
}

export default function MutationPanel({
  type,
  title,
  icon,
  effects,
  onAdd,
  onUpdate,
  onRemove,
}: MutationPanelProps) {
  const isGold = type === "gold";
  const theme = isGold
    ? {
        bg: "bg-cyan-950/20",
        border: "border-cyan-900/40",
        titleColor: "text-cyan-300",
        btnBg: "bg-cyan-800/60 hover:bg-cyan-700 border-cyan-700/50",
        cardBorder: "border-cyan-900/30",
        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        badgeText: "★ Bất Hủ (Sao Kim)",
        focusBorder: "focus:border-cyan-500",
        addText: "Thêm mốc Bất Hủ",
        placeholder: "Mô tả hiệu ứng Bất Hủ...",
        emptyText: "Chưa có mốc Bất Hủ (sao kim) nào.",
        emptyTextLink: "text-cyan-400",
      }
    : {
        bg: "bg-red-950/20",
        border: "border-red-900/40",
        titleColor: "text-red-400",
        btnBg: "bg-red-800/60 hover:bg-red-700 border-red-700/50",
        cardBorder: "border-red-900/30",
        badge: "bg-red-500/20 text-red-400 border-red-500/40",
        badgeText: "★ Sao Đỏ",
        focusBorder: "focus:border-red-500",
        addText: "Thêm mốc sao đỏ",
        placeholder: "Mô tả hiệu ứng...",
        emptyText: "Chưa có mốc suy biến sao đỏ nào.",
        emptyTextLink: "text-red-400",
      };

  const filteredEffects = (effects || [])
    .map((eff, realIdx) => ({ ...eff, realIdx }))
    .filter((eff) => (isGold ? eff.type === "gold" : eff.type !== "gold"));

  return (
    <div className={`space-y-3 ${theme.bg} border ${theme.border} p-3 rounded-lg`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 text-xs ${theme.titleColor} font-black uppercase`}>
          {icon} {title}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className={`text-[10px] ${theme.btnBg} text-white px-2 py-1 rounded flex items-center gap-1 font-bold border transition-colors`}
        >
          <FaPlus size={8} /> {theme.addText}
        </button>
      </div>

      <div className="space-y-2.5">
        {filteredEffects.map((eff) => (
          <div
            key={eff.realIdx}
            className={`bg-slate-950/90 p-2.5 rounded-lg border ${theme.cardBorder} space-y-2 relative group`}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={eff.starLevel || ""}
                onChange={(e) =>
                  onUpdate(eff.realIdx, "starLevel", e.target.value)
                }
                placeholder="Số sao (VD: 1, 4, 5...)"
                className={`w-36 bg-slate-900 border border-slate-700 p-1.5 rounded text-xs text-white outline-none ${theme.focusBorder} font-bold`}
              />

              <span className={`text-[10px] font-black px-2 py-1.5 rounded border transition-colors shrink-0 ${theme.badge}`}>
                {theme.badgeText}
              </span>

              <button
                type="button"
                onClick={() => onRemove(eff.realIdx)}
                className="text-slate-500 hover:text-red-400 p-1 transition-colors ml-auto"
                title="Xóa mốc sao này"
              >
                <FaTrash size={11} />
              </button>
            </div>

            <textarea
              value={eff.effect || ""}
              onChange={(e) =>
                onUpdate(eff.realIdx, "effect", e.target.value)
              }
              placeholder={theme.placeholder}
              className={`w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-slate-300 min-h-[50px] outline-none ${theme.focusBorder} resize-y`}
            />
          </div>
        ))}

        {filteredEffects.length === 0 && (
          <div className={`text-center py-2.5 bg-slate-950/40 rounded border border-dashed ${theme.cardBorder}`}>
            <p className="text-[11px] text-slate-500 italic mb-1">
              {theme.emptyText}
            </p>
            <button
              type="button"
              onClick={onAdd}
              className={`text-[10px] ${theme.emptyTextLink} hover:underline font-bold`}
            >
              + {theme.addText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
