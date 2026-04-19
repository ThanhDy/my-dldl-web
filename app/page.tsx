"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Zap,
  MessageSquare,
  Shield,
  LayoutGrid,
  ChevronRight,
  Monitor,
  Flame,
  Database,
  Crosshair
} from "lucide-react";
import BackToTop from "@/app/components/BackToTop";
import { NeonCard } from "@/app/components/ui/neon-card";
import { Card } from "@/app/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    title: "Hồn Sư",
    description: "Tra cứu thông tin, kỹ năng và build của tất cả hồn sư",
    icon: <Users size={28} />,
    href: "/soul-masters",
    active: true,
    color: "blue"
  },
  {
    title: "Nguyên Hồn Tâm",
    description: "Thông tin chỉ số và hiệu ứng kích hoạt của Nguyên Hồn Tâm",
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
    color: "purple"
  },
  {
    title: "Hệ thống đốt cốt",
    description: "Thông tin chi tiết và tính năng của hệ thống hồn cốt đặc biệt",
    icon: <Flame size={28} />,
    href: "/dot-cot",
    active: true,
    color: "orange"
  },
  {
    title: "Hồn Hoàn Hung Thú",
    description: "Thông tin các loại hồn hoàn hung thú và thuộc tính kết hợp",
    icon: <Database size={28} />,
    href: "/hon-hoan-hung-thu",
    active: true,
    color: "red"
  },
  {
    title: "Hồn Đạo Khí",
    description: "Khám phá các bảo vật Hồn Đạo Khí và các mốc hiệu ứng độc quyền",
    icon: <Crosshair size={28} />,
    href: "/hon-dao-khi",
    active: true,
    color: "cyan"
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* Cyberpunk Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,#020617_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            <span className="block text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">ĐẤU LA</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] pb-10">ĐẠI LỤC WIKI</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-500 text-sm md:text-base font-medium leading-relaxed">
            Hệ thống tra cứu cơ sở dữ liệu hồn sư, nguyên hồn tâm và các phụ kiện cao cấp bậc nhất dành cho các hồn sư thế hệ mới.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {feature.active ? (
                <Link href={feature.href} className="group block h-full">
                  <NeonCard 
                    glowColor={
                      feature.color === 'blue' ? 'bg-blue-600/20' : 
                      feature.color === 'orange' ? 'bg-orange-600/20' : 
                      feature.color === 'red' ? 'bg-red-600/20' : 
                      feature.color === 'cyan' ? 'bg-cyan-600/20' : 
                      'bg-purple-600/20'
                    } 
                    hoverBorderColor={
                      feature.color === 'blue' ? 'hover:border-blue-500/50' : 
                      feature.color === 'orange' ? 'hover:border-orange-500/50' : 
                      feature.color === 'red' ? 'hover:border-red-500/50' : 
                      feature.color === 'cyan' ? 'hover:border-cyan-500/50' : 
                      'hover:border-purple-500/50'
                    }
                    className="p-8 h-full flex flex-col items-start gap-4 border-white/5 transition-all duration-500 group-hover:bg-white/[0.02]"
                  >
                    <div className={`${
                      feature.color === 'blue' ? 'text-blue-400' : 
                      feature.color === 'orange' ? 'text-orange-400' : 
                      feature.color === 'red' ? 'text-red-400' : 
                      feature.color === 'cyan' ? 'text-cyan-400' : 
                      'text-purple-400'
                    } p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                      {feature.icon}
                    </div>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-xl font-black uppercase tracking-tight text-white transition-colors ${
                          feature.color === 'blue' ? 'group-hover:text-blue-400' : 
                          feature.color === 'orange' ? 'group-hover:text-orange-400' : 
                          feature.color === 'red' ? 'group-hover:text-red-400' : 
                          feature.color === 'cyan' ? 'group-hover:text-cyan-400' : 
                          'group-hover:text-purple-400'
                        }`}>
                          {feature.title}
                        </h3>
                        <ChevronRight className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                          feature.color === 'blue' ? 'text-blue-400' : 
                          feature.color === 'orange' ? 'text-orange-400' : 
                          feature.color === 'red' ? 'text-red-400' : 
                          feature.color === 'cyan' ? 'text-cyan-400' : 
                          'text-purple-400'
                        }`} size={18} />
                      </div>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </NeonCard>
                </Link>
              ) : (
                <Card className="p-8 h-full flex flex-col items-start gap-4 border-white/5 bg-white/[0.01] opacity-40 grayscale relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-slate-800 text-[8px] px-2 py-1 rounded-md text-slate-400 font-black uppercase tracking-widest border border-white/5">
                    Sắp ra mắt
                  </div>
                  <div className="text-slate-600 p-3 bg-white/5 rounded-2xl">
                    {feature.icon}
                  </div>
                  <div className="space-y-2 text-left">
                     <h3 className="text-xl font-black uppercase tracking-tight text-slate-400">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-xs font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

      </main>


      <BackToTop />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
