"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { SourceSoulHeart } from "@/data/types";
import SourceSoulHeartModal from "@/app/nguyen-hon-tam/SourceSoulHeartModal";

const rarities = ["Tất cả", "SP", "SSR", "SSR+"];
const types = [
  "Tất cả",
  "Cường Công",
  "Mẫn Công",
  "Khống Chế",
  "Phụ Trợ/Phòng Ngự",
];

export default function SourceSoulHeartPage() {
  const [items, setItems] = useState<SourceSoulHeart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("Tất cả");
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [selectedItem, setSelectedItem] = useState<SourceSoulHeart | null>(
    null,
  );

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/source-soul-hearts");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Logic Lọc và Tìm kiếm
  const filteredList = items.filter((item) => {
    const matchName = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCharacter = item.character
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchRarity =
      selectedRarity === "Tất cả" || item.rarity === selectedRarity;
    const matchType =
      selectedType === "Tất cả" ||
      (selectedType === "Phụ Trợ/Phòng Ngự"
        ? item.type === "Phụ Trợ" || item.type === "Phòng Ngự"
        : item.type === selectedType);

    return (matchName || matchCharacter) && matchRarity && matchType;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 relative">
      {/* Modal Hiển thị Chi Tiết */}
      {selectedItem && (
        <SourceSoulHeartModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <Link
          href="/"
          className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
        >
          <FaArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold text-blue-400">
          Danh Sách Nguyên Hồn Tâm
        </h1>
      </div>

      {/* Thanh tìm kiếm và Bộ lọc */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        {/* Tìm kiếm */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên Nguyên Hồn Tâm hoặc Nhân vật..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter theo độ hiếm */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {rarities.map((rarity) => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedRarity === rarity
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>

        {/* Filter theo hệ (Type) */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Danh sách hiển thị */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div
              className={`relative aspect-square bg-slate-800 rounded-xl overflow-hidden border-2 flex flex-col items-center justify-center p-4 transition-transform group-hover:-translate-y-1 ${
                item.rarity === "SP" || item.rarity === "SP+"
                  ? "border-pink-400"
                  : item.rarity === "SSR+"
                    ? "border-red-500"
                    : item.rarity === "SSR"
                      ? "border-yellow-500"
                      : "border-slate-600"
              }`}
            >
              {/* Badge độ hiếm */}
              <div
                className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold z-10 border ${
                  item.rarity === "SP" || item.rarity === "SP+"
                    ? "bg-gradient-to-b from-pink-400 to-purple-500 text-white border-yellow-200/50"
                    : item.rarity === "SSR+"
                      ? "bg-gradient-to-b from-red-500 to-red-700 text-white border-red-300/50 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                      : "bg-yellow-500 text-white border-yellow-600"
                }`}
              >
                {item.rarity}
              </div>

              {/* Avatar hình tròn */}
              <img
                src={item.avatar}
                alt={item.name}
                className="w-30 h-30 rounded-full object-cover border-2 border-slate-600 mb-3 group-hover:scale-105 transition-transform shadow-lg"
              />

              {/* 2 dòng text */}
              <h3 className="font-bold text-sm text-center text-blue-100 line-clamp-1 w-full">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 text-center mt-1">
                {item.character}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Trạng thái trống */}
      {!loading && filteredList.length === 0 && (
        <div className="text-center text-slate-500 mt-12">
          Không tìm thấy Nguyên Hồn Tâm nào phù hợp.
        </div>
      )}
    </div>
  );
}
