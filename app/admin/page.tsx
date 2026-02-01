// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaFilter } from "react-icons/fa";

interface HeroSummary {
  id: string;
  name: string;
  rarity: string;
  type: string;
  image: string;
}

export default function AdminListPage() {
  const router = useRouter();
  const [heroes, setHeroes] = useState<HeroSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. CÁC STATE BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRarity, setFilterRarity] = useState("ALL"); // ALL, SP, SSR...
  const [filterType, setFilterType] = useState("ALL"); // ALL, Cường Công...

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/soul-masters");
      const data = await res.json();
      if (data.success) setHeroes(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa Hồn sư này?")) return;
    try {
      // 1. Xóa folder ảnh trên Cloudinary trước
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: `soul-masters/${id}` }),
      });

      // 2. Sau đó xóa dữ liệu trong DB
      await fetch(`/api/soul-masters/${id}`, { method: "DELETE" });
      fetchHeroes(); // Load lại danh sách sau khi xóa
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  // --- 2. LOGIC LỌC DỮ LIỆU (KẾT HỢP 3 ĐIỀU KIỆN) ---
  const filteredHeroes = heroes.filter((hero) => {
    // 1. Lọc theo Tên hoặc ID
    const matchSearch =
      hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.id.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Lọc theo Phẩm chất (Nếu chọn ALL thì luôn đúng)
    const matchRarity =
      filterRarity === "ALL" ||
      (filterRarity === "SP_ALL"
        ? hero.rarity.includes("SP")
        : hero.rarity === filterRarity);
    // Mẹo: SP_ALL để lọc cả SP và SP+ nếu muốn

    // 3. Lọc theo Hệ
    const matchType = filterType === "ALL" || hero.type === filterType;

    return matchSearch && matchRarity && matchType;
  });

  return (
    <div className="p-6 bg-slate-950 min-h-full font-sans">
      {/* HEADER & FILTERS */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            Danh Sách Hồn Sư
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị:{" "}
            <strong className="text-white">{filteredHeroes.length}</strong> /{" "}
            {heroes.length} bản ghi
          </p>
        </div>

        {/* KHU VỰC BỘ LỌC */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* 1. Ô Tìm Kiếm */}
          <div className="relative group flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" />
            <input
              type="text"
              placeholder="Tìm tên, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-60 bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* 2. Lọc Phẩm Chất */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="w-full sm:w-32 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="ALL">Tất cả </option>
              <option value="SP+">SP+</option>
              <option value="SP">SP</option>
              <option value="SSR+">SSR+</option>
              <option value="SSR">SSR</option>
            </select>
            <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
          </div>

          {/* 3. Lọc Hệ */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-40 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="ALL">Tất cả</option>
              <option value="Cường Công">Cường Công</option>
              <option value="Mẫn Công">Mẫn Công</option>
              <option value="Khống Chế">Khống Chế</option>
              <option value="Phụ Trợ">Phụ Trợ</option>
              <option value="Phòng Ngự">Phòng Ngự</option>
              <option value="Ám Khí">Ám Khí</option>
            </select>
            <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
          </div>

          {/* Nút CREATE */}
          <Link
            href="/admin/add"
            className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-900/20 transition-transform active:scale-95"
          >
            <FaPlus /> Thêm
          </Link>
        </div>
      </header>

      {/* DANH SÁCH (TABLE) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredHeroes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-slate-500 font-bold">
            Không tìm thấy hồn sư phù hợp.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterRarity("ALL");
              setFilterType("ALL");
            }}
            className="text-blue-500 text-sm mt-2 hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid gap-2">
          {/* Header Bảng (Ẩn trên mobile, hiện trên PC) */}
          <div className="hidden md:grid grid-cols-12 bg-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-t-lg border border-slate-800">
            <div className="col-span-1">Avatar</div>
            <div className="col-span-4">Tên / ID</div>
            <div className="col-span-2">Phẩm Chất</div>
            <div className="col-span-3">Hệ</div>
            <div className="col-span-2 text-right">Thao tác</div>
          </div>

          {filteredHeroes.map((hero) => (
            <div
              key={hero.id}
              onClick={() => router.push(`/admin/edit/${hero.id}`)}
              className="grid grid-cols-12 items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group relative"
            >
              {/* Avatar */}
              <div className="col-span-2 md:col-span-1">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 group-hover:border-blue-500 transition-colors">
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>

              {/* Tên & ID */}
              <div className="col-span-6 md:col-span-4 pl-2 md:pl-0">
                <h3 className="font-bold text-white text-sm group-hover:text-blue-400 truncate">
                  {hero.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono truncate">
                  {hero.id}
                </p>
              </div>

              {/* Rarity */}
              <div className="col-span-4 md:col-span-2 flex items-center">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${
                    hero.rarity.includes("SP")
                      ? "bg-pink-900/20 text-pink-400 border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.1)]"
                      : hero.rarity === "SSR"
                        ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {hero.rarity}
                </span>
              </div>

              {/* Type (Ẩn trên mobile nhỏ) */}
              <div className="hidden md:block col-span-3">
                <span className="text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {hero.type}
                </span>
              </div>

              {/* Actions */}
              <div className="hidden md:flex col-span-2 justify-end gap-2">
                <button
                  className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Sửa"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => handleDelete(e, hero.id)}
                  className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <FaTrash />
                </button>
              </div>

              {/* Nút xóa Mobile (Hiện đè lên góc phải) */}
              <button
                onClick={(e) => handleDelete(e, hero.id)}
                className="md:hidden absolute top-3 right-3 text-slate-600 hover:text-red-500 p-2"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
