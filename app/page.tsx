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
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="28"
        height="28"
        viewBox="13.9 8.0 427.1 822.1"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,419.500000) scale(0.100000,-0.100000)"
          fill="currentColor"
          stroke="none"
        >
          <path d="m2456 3967 c1 -136 3 -153 31 -233 38 -109 115 -250 201 -365 36 -49 177 -201 312 -339 135 -137 268 -277 296 -310 197 -234 282 -418 345 -750 10 -55 19 -103 19 -107 0 -4 -43 -41 -95 -83 -228 -184 -378 -395 -473 -667 -47 -132 -65 -230 -64 -353 0 -184 50 -296 160 -358 135 -76 292 -10 351 147 10 28 31 105 45 171 64 295 97 392 162 491 50 76 171 180 189 163 2 -3 -3 -24 -11 -48 -23 -69 -36 -190 -29 -275 9 -101 33 -195 91 -342 96 -245 124 -370 124 -549 0 -493 -196 -952 -563 -1316 -310 -308 -698 -485 -1159 -529 -171 -16 -504 25 -693 86 -116 38 -306 134 -415 212 -177 126 -375 337 -508 540 -72 111 -184 345 -227 475 -66 202 -95 392 -95 620 0 337 61 603 201 887 78 157 132 244 308 499 258 373 374 594 432 818 18 70 23 116 23 225 1 75 4 134 8 132 21 -13 106 -139 133 -199 72 -155 88 -368 46 -617 -51 -310 -32 -441 79 -542 76 -68 153 -86 268 -62 99 21 162 58 241 142 132 142 206 353 218 624 8 191 -13 332 -108 713 -69 277 -90 406 -90 562 0 194 33 340 116 505 37 75 109 180 123 180 4 0 7 -66 8 -148z m-1920 -5044 c255 -508 740 -874 1314 -992 499 -102 999 -25 1431 219 303 172 586 467 735 768 27 53 51 97 55 97 9 0 339 -218 339 -225 0 -3 -23 -47 -51 -97 -197 -356 -550 -712 -912 -922 -141 -82 -359 -179 -549 -244 -162 -56 -206 -76 -289 -133 -141 -95 -242 -275 -320 -569 l-12 -45 -9 40 c-32 151 -119 354 -193 453 -95 126 -177 177 -428 261 -442 150 -745 334 -1054 639 -50 50 -122 128 -158 174 -71 87 -210 293 -264 390 l-32 57 113 73 c62 40 137 90 168 110 30 21 58 38 62 38 4 0 29 -42 54 -92z m3208 -1365 c-80 -175 -216 -417 -337 -598 -103 -154 -218 -269 -475 -472 -285 -227 -487 -407 -599 -536 l-50 -58 -139 139 c-136 136 -295 272 -584 504 -80 64 -168 138 -197 165 -126 118 -241 275 -380 523 -77 136 -206 390 -201 395 2 2 50 -28 108 -66 208 -138 428 -256 624 -336 198 -81 193 -76 335 -273 70 -96 191 -267 270 -380 79 -113 147 -209 151 -213 4 -5 54 58 111 140 137 199 373 528 417 581 44 56 80 77 232 141 201 85 444 215 600 320 80 55 146 99 147 100 1 0 -14 -34 -33 -76z" />
        </g>
      </svg>
    ),
    href: "/hon-dao-khi",
    active: true,
    color: "cyan"
  },
  {
    title: "Khắc Ấn Hồn Cốt",
    description: "Khám phá hệ thống khắc ấn hồn cốt và các chỉ số cộng thêm",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="28"
        height="28"
        viewBox="0 0 1024.000000 908.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,908.000000) scale(0.100000,-0.100000)"
          fill="currentColor"
          stroke="none"
        >
<path d="M0 4540 l0 -4540 5120 0 5120 0 0 4540 0 4540 -5120 0 -5120 0 0 -4540z m3034 4245 c-32 -221 -29 -571 7 -795 47 -291 175 -602 337 -820 77 -104 210 -239 317 -322 l90 -70 6 54 c8 71 16 84 120 196 146 157 181 261 144 426 -9 43 -14 80 -11 83 3 4 37 -15 76 -42 195 -135 345 -304 529 -595 l66 -105 2 40 c9 137 56 310 110 404 14 25 74 99 133 165 161 183 225 284 281 444 17 51 35 89 39 85 3 -4 14 -35 24 -68 36 -121 121 -264 229 -389 56 -65 119 -138 139 -164 86 -108 144 -269 155 -435 l6 -88 20 33 c75 122 180 276 242 353 95 117 240 256 339 324 l79 54 -7 -34 c-22 -96 -25 -118 -26 -170 0 -113 45 -201 174 -337 87 -91 97 -109 105 -181 l6 -54 80 61 c213 160 406 404 512 645 72 163 110 290 144 482 30 169 32 195 33 425 1 215 -11 404 -30 473 -10 33 12 17 72 -55 323 -385 497 -1002 445 -1574 -24 -257 -98 -632 -152 -771 -6 -15 -15 -40 -19 -56 -10 -31 -14 -33 75 29 74 51 136 85 395 216 305 155 442 249 622 431 148 148 247 287 342 475 70 139 149 433 171 631 9 80 16 69 49 -80 87 -387 83 -855 -9 -1219 -27 -107 -95 -324 -120 -385 -127 -302 -272 -539 -468 -770 -175 -206 -328 -356 -882 -871 -752 -699 -1045 -1072 -1136 -1444 -40 -168 -127 -265 -330 -371 -160 -83 -222 -125 -291 -197 -39 -40 -60 -72 -68 -103 -54 -199 -91 -285 -183 -422 -55 -83 -224 -273 -234 -263 -2 2 7 44 21 92 48 166 59 263 53 444 -7 184 -31 324 -69 392 -29 53 -91 86 -238 123 -151 39 -327 45 -468 16 -156 -33 -257 -67 -290 -100 -33 -33 -55 -98 -77 -226 -38 -214 -30 -393 27 -618 16 -66 28 -121 25 -123 -8 -8 -154 153 -206 227 -99 140 -159 269 -200 435 -30 117 -141 210 -431 360 -84 44 -173 125 -214 197 -15 26 -45 108 -67 182 -43 149 -54 174 -143 319 -201 328 -440 582 -1282 1363 -609 564 -850 880 -1049 1367 -65 158 -144 456 -170 636 -45 312 -26 667 53 995 30 124 27 128 57 -65 50 -325 162 -594 354 -845 65 -86 239 -254 348 -336 130 -98 193 -135 473 -277 135 -68 284 -150 331 -182 l86 -58 -49 166 c-95 325 -131 570 -131 902 -1 329 34 533 137 809 84 224 182 393 339 584 22 26 41 46 43 45 1 -2 -4 -48 -12 -103z m-1744 -3764 c64 -98 183 -240 263 -312 167 -152 301 -211 574 -254 251 -39 365 -77 536 -174 317 -181 600 -486 778 -839 32 -62 71 -148 87 -190 195 -508 223 -565 413 -852 75 -113 163 -248 196 -300 149 -236 284 -542 368 -835 70 -241 148 -393 237 -456 l31 -22 -7 61 c-11 95 -8 303 4 374 18 101 59 226 103 317 49 99 49 99 72 -89 21 -169 43 -255 98 -383 59 -139 107 -211 164 -247 59 -38 89 -38 140 -1 50 36 81 77 122 157 86 174 119 283 141 474 16 138 20 160 29 160 11 0 84 -159 110 -240 46 -140 63 -354 42 -522 -6 -49 -5 -55 9 -48 45 25 139 152 174 234 9 22 37 107 62 190 76 251 132 403 209 563 87 181 139 270 295 503 233 348 300 474 406 757 93 250 153 385 231 514 212 355 517 640 847 789 97 44 216 76 372 100 156 23 274 52 350 85 168 74 347 241 504 471 36 53 60 80 60 68 0 -10 -7 -78 -15 -149 -50 -433 -152 -769 -298 -985 -45 -66 -162 -184 -238 -241 -87 -64 -241 -137 -409 -192 -74 -25 -241 -86 -370 -137 -305 -119 -315 -123 -455 -155 l-120 -28 51 -17 c103 -36 189 -43 404 -36 130 4 242 3 304 -4 96 -11 249 -45 311 -70 30 -12 29 -12 -53 -36 -201 -59 -373 -142 -522 -252 -41 -30 -172 -150 -290 -267 -240 -235 -278 -268 -400 -347 -101 -66 -166 -99 -240 -123 -80 -26 -176 -76 -247 -129 -107 -81 -178 -180 -258 -361 -26 -60 -76 -173 -110 -250 -205 -465 -379 -720 -555 -818 -36 -20 -101 -46 -145 -59 -76 -22 -97 -23 -375 -23 -278 0 -299 1 -375 23 -163 47 -276 129 -382 279 -124 172 -239 393 -373 708 -23 55 -69 155 -101 223 -54 111 -67 130 -147 210 -102 102 -163 140 -309 193 -123 45 -258 122 -370 212 -43 34 -179 161 -303 282 -243 239 -299 284 -460 368 -120 64 -186 90 -319 127 l-95 27 57 21 c31 12 103 32 159 44 94 20 127 22 380 20 282 -2 364 5 463 41 l40 15 -30 7 c-226 53 -215 50 -565 185 -102 39 -256 96 -344 126 -496 170 -714 398 -846 883 -57 212 -120 557 -120 663 0 48 -2 49 50 -31z m8435 -4301 c-3 -4 14 -37 37 -72 36 -52 54 -68 105 -94 l62 -31 -36 -17 c-79 -38 -163 -128 -163 -175 0 -30 -17 -26 -24 5 -9 36 -53 100 -82 119 -14 9 -22 21 -18 27 4 6 3 8 -3 5 -5 -3 -29 3 -52 15 -31 15 -39 23 -29 29 7 5 19 9 26 9 20 0 97 62 124 100 14 19 29 50 33 68 3 18 11 30 16 26 5 -3 7 -9 4 -14z"/>
<path d="M3699 6333 c181 -167 276 -307 339 -504 47 -144 63 -175 144 -284 154 -206 421 -425 651 -533 l88 -42 -105 113 c-262 281 -344 405 -426 641 -28 82 -65 177 -82 210 -101 200 -282 336 -596 450 -40 14 -78 26 -85 26 -6 0 26 -35 72 -77z"/>
<path d="M6780 6359 c-279 -112 -425 -225 -528 -409 -17 -30 -52 -116 -77 -189 -96 -281 -129 -330 -483 -732 l-43 -49 38 16 c151 64 343 196 495 342 192 186 274 308 339 508 17 54 45 126 62 159 41 84 152 220 260 320 51 47 85 85 77 85 -8 0 -71 -23 -140 -51z"/>
<path d="M3300 5215 c0 -60 26 -222 46 -294 29 -100 147 -382 205 -490 52 -97 158 -232 221 -281 95 -76 246 -102 451 -80 137 15 176 9 221 -31 38 -33 50 -72 65 -211 11 -101 30 -141 103 -230 70 -84 94 -104 148 -124 135 -50 160 -66 240 -152 l80 -85 -16 54 c-20 66 -38 103 -75 150 -16 20 -29 38 -29 40 0 2 141 4 314 4 l315 0 -20 -30 c-29 -43 -77 -145 -85 -180 -6 -26 1 -21 61 43 76 82 120 111 220 143 59 19 79 32 127 81 114 115 135 161 157 340 11 92 35 144 82 177 33 22 38 23 139 15 186 -16 316 -11 400 15 70 22 80 28 160 109 98 100 170 211 234 364 24 57 62 144 85 195 23 51 50 132 61 181 20 92 44 272 36 279 -2 2 -30 -33 -62 -79 -68 -96 -177 -214 -243 -263 -26 -18 -76 -45 -111 -58 -115 -43 -313 -148 -388 -205 -135 -103 -234 -230 -354 -455 -38 -73 -87 -154 -108 -182 -58 -78 -261 -281 -300 -300 -87 -44 -722 -46 -805 -2 -39 20 -264 247 -310 312 -20 27 -65 106 -102 175 -82 155 -128 224 -211 318 -124 139 -271 235 -519 337 -60 24 -114 55 -155 90 -68 56 -172 175 -233 268 -41 61 -45 65 -45 42z"/>
</g>
</svg>),
    href: "/khac-an-hon-cot",
    active: true,
    color: "emerald"
  },
  {
    title: "Thần Thú",
    description: "Tra cứu thông tin, kỹ năng và hiệu ứng của các Thần Thú",
    icon: <PawPrint size={28} />,
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
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] pb-10">ĐẠI LỤC WIKI</span>
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
