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
        viewBox="0 0 879.000000 879.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,879.000000) scale(0.100000,-0.100000)"
          fill="currentColor"
          stroke="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2164 8459 c-36 -269 -18 -655 41 -904 27 -115 100 -327 140 -406 89 -175 225 -360 355 -482 78 -74 208 -177 223 -177 4 0 7 21 7 46 0 66 23 105 121 210 152 161 184 276 129 463 -5 19 -8 37 -5 39 8 8 146 -88 218 -151 120 -106 280 -308 397 -499 29 -49 56 -88 60 -88 4 0 8 30 9 66 3 119 49 282 106 380 13 22 70 92 125 155 164 183 228 284 285 447 17 45 32 82 36 82 3 0 13 -26 23 -57 24 -77 107 -242 155 -306 21 -29 81 -101 134 -160 97 -108 148 -184 181 -266 30 -76 56 -203 56 -273 0 -38 4 -68 10 -68 5 0 17 15 26 33 74 142 280 414 403 529 74 69 229 183 238 174 2 -2 -3 -43 -12 -91 -33 -173 -2 -255 163 -430 67 -71 85 -98 98 -141 8 -30 13 -63 9 -74 -3 -11 -3 -20 1 -20 4 0 40 25 80 55 455 343 699 890 698 1570 0 131 -6 246 -17 334 -10 73 -16 135 -14 138 7 6 110 -117 155 -185 192 -284 308 -611 353 -997 18 -157 6 -497 -25 -690 -34 -215 -70 -374 -112 -497 -19 -56 -34 -107 -34 -114 0 -6 39 14 88 47 48 32 194 112 325 179 354 179 474 259 661 440 150 144 268 305 359 485 79 158 156 435 173 624 4 41 11 68 16 63 11 -11 55 -207 74 -334 21 -146 29 -477 15 -634 -20 -219 -91 -519 -170 -725 -36 -93 -157 -342 -211 -434 -166 -281 -420 -561 -985 -1084 -530 -492 -736 -699 -927 -934 -195 -239 -326 -468 -366 -637 -28 -117 -48 -159 -110 -233 -62 -73 -101 -101 -234 -170 -135 -70 -206 -116 -263 -168 -62 -57 -82 -94 -111 -201 -34 -122 -98 -257 -177 -371 -68 -97 -202 -246 -212 -235 -3 3 1 30 9 59 72 248 81 484 29 739 -34 168 -80 203 -338 257 -105 22 -137 24 -250 20 -192 -8 -404 -65 -457 -124 -49 -54 -93 -281 -92 -478 1 -139 18 -255 58 -395 14 -46 23 -87 20 -89 -7 -8 -129 124 -189 204 -111 147 -176 288 -225 482 -22 90 -153 198 -379 313 -120 61 -214 143 -261 226 -17 29 -44 100 -59 156 -39 144 -59 190 -134 316 -186 313 -471 622 -1157 1259 -649 603 -845 825 -1039 1180 -125 228 -207 435 -265 674 -87 361 -102 672 -50 1035 18 131 69 346 77 324 2 -8 10 -58 17 -110 15 -119 73 -351 111 -447 120 -303 325 -567 605 -778 126 -95 209 -144 486 -283 128 -65 268 -142 311 -171 43 -29 80 -51 82 -49 2 2 -12 55 -31 117 -70 233 -112 445 -135 686 -17 180 -7 506 20 660 65 371 215 704 434 968 27 32 51 57 53 54 2 -2 -3 -59 -12 -128z M425 4727 c85 -132 257 -317 370 -399 120 -86 254 -132 495 -168 227 -35 355 -79 532 -183 300 -176 586 -491 753 -827 58 -116 92 -196 158 -375 103 -276 176 -418 351 -680 179 -267 239 -366 315 -515 78 -152 175 -390 216 -525 14 -49 38 -127 51 -172 32 -108 75 -202 124 -272 59 -83 131 -133 116 -78 -4 12 -9 74 -13 138 -7 129 7 268 38 382 19 71 107 267 119 267 3 0 16 -75 28 -167 25 -188 56 -293 132 -449 55 -114 111 -178 172 -196 36 -11 45 -9 85 12 55 29 92 75 144 182 83 168 107 251 135 476 10 78 22 142 26 142 12 0 57 -94 94 -196 54 -150 67 -242 62 -441 -2 -95 -1 -173 3 -173 30 0 133 131 169 215 11 27 50 143 86 259 136 435 231 630 514 1056 223 335 263 410 386 730 180 472 293 658 554 920 146 147 238 218 393 306 163 93 295 133 587 179 146 23 280 70 370 130 104 68 291 258 369 375 35 52 68 100 74 105 20 21 -12 -265 -53 -465 -27 -131 -93 -360 -129 -448 -72 -174 -200 -344 -336 -446 -100 -75 -243 -145 -411 -202 -76 -25 -230 -82 -343 -126 -318 -124 -357 -137 -485 -168 -65 -17 -121 -32 -123 -34 -7 -7 93 -35 164 -46 34 -6 180 -9 325 -8 189 2 284 -1 338 -11 78 -14 229 -58 242 -70 5 -4 -43 -22 -105 -39 -139 -41 -343 -139 -462 -223 -56 -40 -165 -140 -295 -269 -305 -305 -461 -419 -674 -491 -83 -28 -152 -65 -216 -114 -141 -109 -184 -174 -335 -516 -316 -711 -465 -904 -765 -986 -55 -15 -108 -18 -355 -18 -329 0 -368 6 -506 77 -101 51 -185 129 -265 244 -123 177 -187 299 -360 691 -125 285 -143 317 -211 395 -98 113 -183 171 -326 222 -245 89 -362 175 -697 507 -107 107 -224 215 -258 242 -142 106 -360 209 -535 253 -38 9 -65 20 -60 24 15 14 166 58 248 71 57 10 157 13 344 11 154 -1 287 2 321 8 75 14 163 40 157 47 -3 2 -60 18 -128 34 -67 16 -194 58 -283 93 -326 128 -384 150 -515 192 -302 99 -485 215 -621 396 -174 231 -271 550 -346 1136 -3 23 -2 42 3 42 4 0 26 -28 48 -63z M2852 6023 c123 -120 209 -226 249 -305 16 -32 48 -114 70 -181 51 -153 66 -182 147 -287 168 -216 382 -394 616 -512 54 -27 99 -48 101 -46 2 2 -44 55 -102 118 -250 275 -344 421 -418 650 -103 320 -251 469 -602 609 -173 68 -176 67 -61 -46z M6015 6108 c-182 -63 -310 -126 -421 -210 -137 -102 -210 -210 -282 -418 -104 -297 -153 -373 -461 -709 -40 -45 -70 -81 -67 -81 4 0 48 21 99 46 204 102 418 273 573 457 95 113 159 230 199 362 52 175 119 276 298 453 63 61 109 112 103 111 -6 0 -24 -5 -41 -11z M2444 4840 c9 -133 35 -233 105 -398 34 -79 61 -146 61 -148 0 -12 94 -192 125 -237 48 -73 117 -152 173 -198 92 -77 241 -99 503 -75 83 7 101 6 134 -9 64 -31 88 -91 101 -258 5 -69 10 -84 47 -140 23 -34 69 -89 102 -123 51 -52 71 -64 130 -83 92 -30 164 -79 227 -157 28 -35 53 -62 56 -60 10 11 -31 118 -68 174 -22 35 -40 64 -40 65 0 1 139 2 310 2 170 0 310 -1 310 -2 0 -2 -15 -26 -34 -55 -31 -50 -81 -167 -73 -174 2 -2 43 36 93 85 84 83 93 89 174 115 80 26 90 33 160 105 96 98 119 146 136 278 15 115 33 165 71 205 37 38 74 43 233 28 260 -25 381 10 503 145 79 87 165 220 202 313 15 37 51 121 80 188 72 163 122 368 113 468 l-3 39 -50 -74 c-55 -82 -175 -212 -247 -270 -26 -20 -69 -45 -95 -55 -84 -31 -309 -140 -359 -175 -83 -57 -220 -197 -282 -288 -33 -47 -92 -149 -133 -225 -79 -149 -154 -244 -311 -392 -103 -97 -108 -98 -473 -99 -159 0 -316 4 -348 8 -75 11 -108 37 -266 208 -119 127 -131 145 -215 302 -50 91 -109 192 -133 224 -60 81 -177 197 -248 248 -68 49 -240 136 -365 186 -78 31 -93 42 -191 139 -58 58 -127 137 -154 175 -70 101 -68 101 -61 -5z"
          />
        </g>
      </svg>
    ),
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
