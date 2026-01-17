"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

// 1. Xóa dòng import soulMastersRaw từ json
// Chúng ta sẽ dùng State để chứa dữ liệu lấy từ API

const types = [
  "Tất cả",
  "Cường Công",
  "Mẫn Công",
  "Khống Chế",
  "Phụ Trợ",
  "Phòng Ngự",
];

export default function SoulMastersPage() {
  // 2. Thêm state để lưu danh sách tướng và trạng thái loading
  const [heroes, setHeroes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tất cả");

  // 3. Sử dụng useEffect để gọi API khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy danh sách vắn tắt (nhẹ)
        const res = await fetch("/api/heroes");
        if (!res.ok) throw new Error("Lỗi tải dữ liệu");
        const data = await res.json();
        setHeroes(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 4. Lọc trên danh sách 'heroes' (state) thay vì biến tĩnh
  const filteredList = heroes.filter((char) => {
    const matchName = char.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = selectedType === "Tất cả" || char.type === selectedType;
    return matchName && matchType;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header & Nut Back */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <Link
          href="/"
          className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
        >
          <FaArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold text-blue-400">Danh Sách Hồn Sư</h1>
      </div>

      {/* Thanh Tìm kiếm & Filter */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên hồn sư..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
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

      {/* Grid Danh sách Tướng */}
      {loading ? (
        // Hiển thị khi đang tải
        <div className="text-center text-slate-500 py-20">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredList.map((char) => (
            <Link
              href={`/soul-masters/${char.id}`}
              key={char.id}
              className="group"
            >
              <div
                className={`relative bg-slate-800 rounded-xl overflow-hidden border-2 transition-transform group-hover:-translate-y-1 ${
                  char.rarity === "SP" || char.rarity === "SP+" // Hỗ trợ cả SP và SP+
                    ? "border-pink-400 " // Viền vàng kim sáng hơn, bóng mạnh hơn
                    : char.rarity === "SSR"
                      ? "border-yellow-500" // Đổi sang viền vàng
                      : "border-slate-600"
                }`}
              >
                {/* Badge Rarity */}
                <div
                  className={`absolute top-2 right-2 px-3 py-0.5 rounded-full text-xs font-bold z-10 border ${
                    char.rarity === "SP" || char.rarity === "SP+"
                      ? // Gradient dọc: Hồng -> Tím -> Xanh dương + viền vàng nhạt
                        "bg-gradient-to-b from-pink-400 via-purple-400 to-cyan-400 text-white border-yellow-200/50"
                      : char.rarity === "SSR"
                        ? "bg-yellow-500 text-white border-yellow-600" // Nền vàng
                        : "bg-purple-600 text-white border-purple-800"
                  }`}
                >
                  {char.rarity}
                </div>

                {/* Ảnh */}
                <div className="aspect-[3/4] bg-slate-700 relative">
                  {char.image ? (
                    <Image
                      src={char.image}
                      alt={char.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-600">
                      {char.name.charAt(0)}
                    </div>
                  )}

                  {/* Hệ (Icon nhỏ góc trái dưới) */}
                  <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-blue-200">
                    {char.type}
                  </div>
                </div>

                {/* Tên */}
                <div className="p-3 text-center">
                  <h3 className="font-bold text-sm truncate">{char.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Thông báo nếu không tìm thấy (Chỉ hiện khi đã load xong và list rỗng) */}
      {!loading && filteredList.length === 0 && (
        <div className="text-center text-slate-500 mt-12">
          Không tìm thấy hồn sư nào phù hợp.
        </div>
      )}
    </div>
  );
}
