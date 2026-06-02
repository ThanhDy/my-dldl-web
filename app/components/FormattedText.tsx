import React from "react";

const colorMap: Record<string, string> = {
  red: "text-rose-500",
  yellow: "text-amber-400",
  blue: "text-blue-400",
  green: "text-emerald-400",
  purple: "text-purple-400",
  orange: "text-orange-500",
  cyan: "text-cyan-400",
  gray: "text-slate-500",
  white: "text-white",
};

export const formatText = (text: string | undefined | null) => {
  if (!text) return null;

  const parts = text.split(/(\[[^\[\]\|]+?\|[^\]]*?(?:\[.*?\][^\]]*?)*\])/g);

  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      const partsOfPart = part.slice(1, -1).split("|");
      const colorRaw = partsOfPart[0];
      const label = partsOfPart.slice(1).join("|");
      const color = colorRaw ? colorRaw.trim().toLowerCase() : "";
      return (
        <span
          key={index}
          className={`font-black ${colorMap[color] || "text-slate-200"}`}
        >
          {label}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

interface FormattedTextProps {
  text: string | undefined | null;
  className?: string;
}

export default function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;
  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {formatText(text)}
    </span>
  );
}
