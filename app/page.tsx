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

const features = [
  {
    title: "Hồn Sư",
    icon: <FaUser size={24} />,
    href: "/soul-masters",
    active: true,
  },
  {
    title: "Ám Khí",
    icon: <FaSkull size={24} />,
    href: "/hidden-weapons",
    active: false,
  },
  {
    title: "Thần Khí",
    icon: <FaGem size={24} />,
    href: "/divine-weapons",
    active: false,
  },
  {
    title: "Hồn Hoàn Riêng",
    icon: <FaMagic size={24} />,
    href: "/god-rings",
    active: false,
  },
  {
    title: "Hồn Linh",
    icon: <FaGhost size={24} />,
    href: "/soul-spirits",
    active: false,
  },
  {
    title: "Hồn Hoàn Thông Dụng",
    icon: <GiMagicPortal size={24} />,
    href: "/general-rings",
    active: false,
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
            <Link key={index} href={feature.href} className="group relative">
              <div className="absolute -inset-0.5 bg-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-slate-900/90 border border-slate-700 p-4 rounded-xl hover:border-blue-500/50 transition-all flex flex-col items-center text-center gap-2 backdrop-blur-sm overflow-hidden h-full">
                <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-[10px] font-bold tracking-widest uppercase group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[sweep_1.5s_infinite]" />
              </div>
            </Link>
          ) : (
            <div
              key={index}
              className="relative bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl flex flex-col items-center text-center gap-2 opacity-60"
            >
              <div className="absolute -top-1 -right-1 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] text-[8px] px-2 py-0.5 rounded-full text-white font-black uppercase tracking-tighter border border-red-400 z-10">
                Sắp ra mắt
              </div>

              <div className="text-slate-600 grayscale">{feature.icon}</div>
              <h3 className="text-[10px] font-bold uppercase text-slate-500 italic">
                {feature.title}
              </h3>
            </div>
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
