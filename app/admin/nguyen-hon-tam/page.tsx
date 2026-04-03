"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { SourceSoulHeart } from "@/data/types";
import AdminSourceSoulHeartModal from "./AdminSourceSoulHeartModal";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Button } from "@/components/ui/button";

const rarities = ["Tất cả", "SP", "SSR+", "SSR"];
const types = [
  "Tất cả",
  "Cường Công",
  "Mẫn Công",
  "Khống Chế",
  "Phụ Trợ/Phòng Ngự",
];

export default function AdminSourceSoulHeartPage() {
  const [items, setItems] = useState<SourceSoulHeart[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SourceSoulHeart | null>(null);

  // --- STATE BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("Tất cả");
  const [selectedType, setSelectedType] = useState("Tất cả");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/source-soul-hearts");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải dữ liệu Nguyên Hồn Tâm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- LOGIC LỌC KẾT HỢP ---
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

  const handleAddNew = () => {
    const newItem: SourceSoulHeart = {
      id: "", // ID rỗng để server biết đây là item mới
      name: "",
      character: "",
      rarity: "SSR",
      type: "Cường Công",
      avatar: "",
      basicStat: "",
      basicSkill: "",
      isExtend: false,
      starEffects: [],
    };
    setEditingItem(newItem);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-full font-sans">
      {/* KHI EDITING ITEM != NULL SẼ HIỆN MODAL */}
      {editingItem && (
        <AdminSourceSoulHeartModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={() => {
            // Tải lại danh sách sau khi lưu thành công
            fetchItems();
            setEditingItem(null);
          }}
          onDelete={async (id) => {
            if (!confirm("Bạn có chắc chắn muốn xóa Nguyên Hồn Tâm này?"))
              return;
            try {
              const res = await fetch(`/api/source-soul-hearts?id=${id}`, {
                method: "DELETE",
              });
              if (!res.ok) throw new Error("Failed to delete item");
              fetchItems(); // Tải lại danh sách sau khi xóa
              setEditingItem(null);
            } catch (error) {
              console.error(error);
              alert("Lỗi khi xóa Nguyên Hồn Tâm!");
            }
          }}
        />
      )}

      {/* HEADER & FILTERS */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            Quản Lý Nguyên Hồn Tâm
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị:{" "}
            <strong className="text-white">{filteredList.length}</strong> /{" "}
            {items.length}
          </p>
        </div>

        {/* KHU VỰC BỘ LỌC */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* 1. Ô Tìm Kiếm */}
          <div className="relative group flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" />
            <Input
              type="text"
              placeholder="Tìm tên, nhân vật..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-60 bg-slate-900 border-slate-800 pl-9 pr-4 py-2 text-sm focus-visible:ring-blue-500 text-slate-200"
            />
          </div>

          {/* 2. Lọc Phẩm Chất */}
          <div className="relative flex-1 sm:flex-none">
            <Select value={selectedRarity} onValueChange={(val) => val && setSelectedRarity(val)}>
              <SelectTrigger className="w-full sm:w-[130px] bg-slate-900 border-slate-800 text-sm text-slate-300 focus:ring-blue-500">
                <SelectValue placeholder="Phẩm chất" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                {rarities.map((r) => (
                  <SelectItem key={r} value={r} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Lọc Hệ */}
          <div className="relative flex-1 sm:flex-none">
            <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-slate-900 border-slate-800 text-sm text-slate-300 focus:ring-blue-500">
                <SelectValue placeholder="Hệ" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                {types.map((t) => (
                  <SelectItem key={t} value={t} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nút THÊM MỚI */}
          <Button
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-900/20 transition-transform active:scale-95 h-9 sm:h-auto"
          >
            <FaPlus /> Thêm
          </Button>
        </div>
      </header>

      {/* DANH SÁCH (GRID ITEM) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-slate-500 font-bold">
            Không tìm thấy Nguyên Hồn Tâm nào phù hợp.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRarity("Tất cả");
              setSelectedType("Tất cả");
            }}
            className="text-blue-500 text-sm mt-2 hover:underline outline-none"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredList.map((item) => (
            <div key={item.id} className="group relative">
              <div
                onClick={() => setEditingItem(item)}
                className={`relative aspect-square bg-slate-900/80 rounded-xl overflow-hidden border-2 flex flex-col items-center justify-center p-4 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  item.rarity === "SP" || item.rarity === "SP+"
                    ? "border-pink-500/50 hover:border-pink-400"
                    : item.rarity === "SSR+"
                      ? "border-red-500/50 hover:border-red-400"
                      : item.rarity === "SSR"
                        ? "border-yellow-500/50 hover:border-yellow-400"
                        : "border-slate-700 hover:border-slate-500"
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

                {/* Hình ảnh */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-700 mb-3 overflow-hidden shadow-lg group-hover:scale-105 transition-transform bg-slate-800">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thông tin Text */}
                <h3 className="font-bold text-xs sm:text-sm text-center text-slate-200 line-clamp-1 w-full group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 text-center mt-1 truncate w-full">
                  {item.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
