"use client";

import Link from "next/link";
import { FaUser, FaSkull, FaGem, FaGhost, FaMagic } from "react-icons/fa";
import { GiMagicPortal } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";

const features = [
  { title: "Hồn Sư", icon: <FaUser size={40} />, href: "/soul-masters", active: true, description: "Tra cứu kỹ năng, build hồn hoàn, đội hình." },
  { title: "Ám Khí", icon: <FaSkull size={40} />, href: "/hidden-weapons", active: false, description: "Hệ thống đường môn ám khí." },
  { title: "Thần Khí", icon: <FaGem size={40} />, href: "/divine-weapons", active: false, description: "Thông tin các loại thần khí." },
  { title: "Hồn Linh", icon: <FaGhost size={40} />, href: "/soul-spirits", active: false, description: "Hệ thống trợ chiến và kỹ năng của Hồn Linh." },
  { title: "Hồn Hoàn Hung Thú", icon: <GiMagicPortal size={40} />, href: "/general-rings", active: false, description: "Các loại hồn hoàn hung thú." },
  { title: "Hồn Hoàn Riêng", icon: <FaMagic size={40} />, href: "/god-rings", active: false, description: "Hệ thống hồn hoàn riêng biệt của tướng." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black text-white p-8">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)] uppercase tracking-tighter">
          Đấu La Đại Lục Wiki
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full" />
      </div>

      {/* Slider Section */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <Swiper
          modules={[Pagination]}
          pagination={{ 
            clickable: true,
            el: '.custom-pagination', 
          }}
          spaceBetween={24}
          slidesPerView={1}
          grabCursor={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="hero-swiper"
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index} className="h-auto pb-10"> 
              {feature.active ? (
                <Link href={feature.href} className="block group relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                  <div className="relative bg-slate-900/80 border border-slate-700 p-8 rounded-2xl group-hover:border-blue-500/50 transition-all h-full cursor-pointer overflow-hidden backdrop-blur-sm flex flex-col min-h-[320px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[sweep_2s_infinite] transition-transform duration-1000" />
                    <div className="text-blue-400 mb-6 transform group-hover:scale-110 transition-transform">
                      <div className="p-4 inline-block bg-blue-500/10 rounded-2xl shadow-inner">{feature.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-300">{feature.title}</h3>
                    <p className="text-slate-400 text-sm flex-grow">{feature.description}</p>
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px] uppercase tracking-widest mt-auto">Truy cập ngay →</div>
                  </div>
                </Link>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl relative overflow-hidden h-full cursor-not-allowed flex flex-col min-h-[320px]">
                  <div className="absolute top-4 right-4 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] text-[11px] px-3 py-1 rounded-full text-white font-black uppercase tracking-tighter border border-red-400 animate-pulse z-10">
                    Sắp ra mắt
                  </div>
                  <div className="text-slate-600 mb-6 p-4 inline-block bg-slate-800/20 rounded-2xl grayscale">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-500 italic">{feature.title}</h3>
                  <p className="text-slate-700 text-xs italic flex-grow">{feature.description}</p>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>


        <div className="custom-pagination flex justify-center gap-2 mt-4 z-30 relative" />
      </div>

      <style jsx global>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Tùy chỉnh dấu chấm */
        .custom-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #475569 !important; /* Màu xám */
          opacity: 1 !important;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .custom-pagination .swiper-pagination-bullet-active {
          background: #60a5fa !important; /* Màu xanh sáng */
          width: 25px; /* Dài ra khi active */
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
        }
      `}</style>
    </div>
  );
}