"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SoulMaster } from "@/data/types";
import { FaSearch, FaArrowLeft } from "react-icons/fa"; // Import thêm FaArrowLeft

export default function SoulMastersPage() {
  const [heroes, setHeroes] = useState<SoulMaster[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Tất Cả");

  useEffect(() => {
    fetch("/api/heroes")
      .then((res) => res.json())
      .then((data) => setHeroes(data));
  }, []);

  const types = ["Tất Cả", "Cường Công", "Mẫn Công", "Khống Chế", "Phụ Trợ", "Phòng Ngự", "Ám Khí"];

  const filteredHeroes = heroes.filter((hero) => {
    const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "Tất Cả" || hero.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-12 space-y-6">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-tighter">
            Tổng Quan Hồn Sư
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm kiếm hồn sư..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-yellow-500/50 transition"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap border ${
                    selectedType === t
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Grid Danh sách */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredHeroes.map((hero) => (
            <Link
              href={`/soul-masters/${hero.id}`}
              key={hero.id}
              className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-yellow-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="relative aspect-[3/4]">
                {/* Rarity Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider shadow-md ${
                      hero.rarity === "SSR+"
                        ? "bg-red-600 text-white border border-red-400" 
                        : hero.rarity === "SP" || hero.rarity === "SP+"
                        ? "bg-gradient-to-b from-pink-500 to-purple-600 text-white"
                        : hero.rarity === "SSR"
                        ? "bg-yellow-500 text-black"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {hero.rarity}
                  </span>
                </div>

                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-10">
                  <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-1 opacity-80">
                    {hero.title}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {hero.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-slate-300">
                      {hero.type}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredHeroes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 italic text-lg">Không tìm thấy hồn sư phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  );
}