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
  Crosshair,
  PawPrint
} from "lucide-react";
import BackToTop from "@/app/components/BackToTop";
import { NeonCard } from "@/app/components/ui/neon-card";
import { Card } from "@/app/components/ui/card";
import { motion } from "framer-motion";
import {
  NguyenHonTamIcon,
  HonHoanHungThuIcon,
  HonDaoKhiIcon,
  KhacAnHonCotIcon,
  ThanThuIcon
} from "@/app/components/Icons";

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
    icon: <NguyenHonTamIcon size={24} className="scale-150" />,
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
    icon: <HonHoanHungThuIcon />,
    href: "/hon-hoan-hung-thu",
    active: true,
    color: "red"
  },
  {
    title: "Hồn Đạo Khí",
    description: "Khám phá các bảo vật Hồn Đạo Khí và các mốc hiệu ứng độc quyền",
    icon: <HonDaoKhiIcon />,
    href: "/hon-dao-khi",
    active: true,
    color: "cyan"
  },
  {
    title: "Khắc Ấn Hồn Cốt",
    description: "Khám phá hệ thống khắc ấn hồn cốt và các chỉ số cộng thêm",
    icon: <KhacAnHonCotIcon />,
    href: "/khac-an-hon-cot",
    active: true,
    color: "emerald"
  },
  {
    title: "Thần Thú",
    description: "Tra cứu thông tin, kỹ năng và hiệu ứng của các Thần Thú",
    icon: <ThanThuIcon />,
    href: "/than-thu",
    active: true,
    color: "yellow"
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
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] px-4 pb-10">ĐẠI LỤC WIKI</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-500 text-sm md:text-base font-medium leading-relaxed">
            Hệ thống tra cứu cơ sở dữ liệu hồn sư, nguyên hồn tâm và các phụ kiện cao cấp bậc nhất dành cho các hồn sư thế hệ mới
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
                      feature.color === 'emerald' ? 'bg-emerald-600/20' : 
                      feature.color === 'yellow' ? 'bg-yellow-600/20' : 
                      'bg-purple-600/20'
                    } 
                    hoverBorderColor={
                      feature.color === 'blue' ? 'hover:border-blue-500/50' : 
                      feature.color === 'orange' ? 'hover:border-orange-500/50' : 
                      feature.color === 'red' ? 'hover:border-red-500/50' : 
                      feature.color === 'cyan' ? 'hover:border-cyan-500/50' : 
                      feature.color === 'emerald' ? 'hover:border-emerald-500/50' : 
                      feature.color === 'yellow' ? 'hover:border-yellow-500/50' : 
                      'hover:border-purple-500/50'
                    }
                    className="p-8 h-full flex flex-col items-start gap-4 border-white/5 transition-all duration-500 group-hover:bg-white/[0.02]"
                  >
                    <div className={`${
                      feature.color === 'blue' ? 'text-blue-400' : 
                      feature.color === 'orange' ? 'text-orange-400' : 
                      feature.color === 'red' ? 'text-red-400' : 
                      feature.color === 'cyan' ? 'text-cyan-400' : 
                      feature.color === 'emerald' ? 'text-emerald-400' : 
                      feature.color === 'yellow' ? 'text-yellow-400' : 
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
                          feature.color === 'emerald' ? 'group-hover:text-emerald-400' : 
                          feature.color === 'yellow' ? 'group-hover:text-yellow-400' : 
                          'group-hover:text-purple-400'
                        }`}>
                          {feature.title}
                        </h3>
                        <ChevronRight className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                          feature.color === 'blue' ? 'text-blue-400' : 
                          feature.color === 'orange' ? 'text-orange-400' : 
                          feature.color === 'red' ? 'text-red-400' : 
                          feature.color === 'cyan' ? 'text-cyan-400' : 
                          feature.color === 'emerald' ? 'text-emerald-400' : 
                          feature.color === 'yellow' ? 'text-yellow-400' : 
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
