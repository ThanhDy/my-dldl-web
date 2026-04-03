"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaUser,
  FaSkull,
  FaGem,
  FaGhost,
  FaMagic,
  FaDiscord,
  FaComments,
} from "react-icons/fa";
import { GiMagicPortal } from "react-icons/gi";
import BackToTop from "@/app/components/BackToTop";
import { color } from "framer-motion";
import { NeonCard } from "@/app/components/ui/neon-card";
import { Card } from "@/app/components/ui/card";

const features = [
  {
    title: "Hồn Sư",
    icon: <FaUser size={24} />,
    href: "/soul-masters",
    active: true,
  },
  {
    title: "Nguyên Hồn Tâm",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="24"
        height="24"
        viewBox="0 0 55.000000 49.000000"
        preserveAspectRatio="xMidYMid meet"
        className="scale-150"
      >
        <g
          transform="translate(0.000000,49.000000) scale(0.100000,-0.100000)"
          fill="currentColor"
          stroke="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0 h550 v490 h-550 z M0 245 l0 -245 275 0 275 0 0 245 0 245 -135 0 c-83 0 -135 -4 -135 -10 0 -6 9 -19 20 -30 l20 -20 -21 -21 c-14 -14 -18 -27 -13 -42 8 -28 43 -67 69 -77 14 -6 15 -9 4 -9 -20 -1 -65 -49 -74 -81 l-8 -25 -11 27 c-14 33 -45 68 -71 79 -14 5 -15 8 -4 8 19 1 65 49 73 78 5 15 1 28 -13 42 -21 21 -21 21 -1 41 11 11 20 25 20 30 0 6 -52 10 -135 10 l-135 0 0 -245z m418 119 c28 -32 29 -78 1 -123 l-21 -35 24 15 c12 9 33 35 46 59 21 43 22 43 22 14 0 -16 -9 -46 -19 -67 -20 -40 -20 -42 10 -27 10 6 19 7 19 2 0 -19 -51 -54 -96 -66 -43 -11 -52 -18 -77 -62 l-28 -49 4 58 c3 51 2 56 -11 43 -13 -13 -17 -12 -33 7 -17 21 -17 20 -13 -43 l5 -65 -28 49 c-25 44 -34 51 -77 62 -32 8 -61 24 -80 45 -29 30 -27 32 18 13 11 -4 10 3 -5 32 -10 21 -19 52 -19 69 0 30 1 30 19 -11 18 -39 53 -74 75 -74 5 0 0 10 -12 22 -41 45 -37 124 9 148 26 14 75 12 88 -3 8 -11 5 -13 -19 -9 -36 5 -80 -35 -80 -74 0 -26 22 -51 102 -119 l36 -31 34 31 c19 16 46 40 61 52 68 57 28 161 -53 140 -26 -7 -15 12 14 23 29 12 57 3 84 -26z"
          />
        </g>
      </svg>
    ),
    href: "/nguyen-hon-tam",
    active: true,
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black text-white p-6 flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)] uppercase tracking-tighter">
          Đấu La Đại Lục Wiki
        </h1>
        <div className="h-0.5 w-16 bg-blue-500 mx-auto rounded-full shadow-[0_0_8px_#3b82f6]" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl w-full px-4 mb-10">
        {features.map((feature, index) =>
          feature.active ? (
            <Link key={index} href={feature.href} className="w-full">
              <NeonCard glowColor="bg-blue-600/30" hoverBorderColor="hover:border-blue-500/80" className="p-4 items-center text-center gap-2 border-slate-700/50">
                <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-100 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
              </NeonCard>
            </Link>
          ) : (
            <Card
              key={index}
              className="relative bg-slate-900/40 border-slate-800/50 p-4 rounded-xl flex flex-col items-center text-center gap-2 opacity-60"
            >
              <div className="absolute -top-1 -right-1 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] text-[8px] px-2 py-0.5 rounded-full text-white font-black uppercase tracking-tighter border border-red-400 z-10">
                Sắp ra mắt
              </div>

              <div className="text-slate-600 grayscale">{feature.icon}</div>
              <h3 className="text-[10px] font-bold uppercase text-slate-300 italic">
                {feature.title}
              </h3>
            </Card>
          ),
        )}
      </div>

      <div className="flex flex-col items-center gap-4 mt-auto">
        <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">
          <FaComments className="text-blue-500/50" />
          <span>Thảo luận tại</span>
        </div>

        <a
          href="https://discord.gg/a4E7Uqzg"
          target="_blank"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full hover:border-indigo-500 hover:bg-indigo-500/20 transition-all group shadow-[0_0_15px_rgba(88,101,242,0.1)]"
        >
          <FaDiscord
            className="text-[#5865F2] group-hover:scale-110 transition-transform duration-300"
            size={18}
          />
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">
            Đấu La Đại Lục - Nơi Giao Lưu Giữa Các Hồn Sư
          </span>
        </a>
      </div>

      {/* Back to Top Button */}
      <BackToTop />

      <style jsx global>{`
        @keyframes sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
