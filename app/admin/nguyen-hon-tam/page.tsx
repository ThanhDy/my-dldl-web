"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Database, 
  LayoutGrid, 
  MoreVertical,
  ArrowRightCircle,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { SourceSoulHeart } from "@/data/types";
import AdminSourceSoulHeartModal from "./AdminSourceSoulHeartModal";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinary } from "@/lib/utils";

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

  const filteredList = items.filter((item) => {
    const matchName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCharacter = item.character.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRarity = selectedRarity === "Tất cả" || item.rarity === selectedRarity;
    const matchType = selectedType === "Tất cả" ||
      (selectedType === "Phụ Trợ/Phòng Ngự"
        ? item.type === "Phụ Trợ" || item.type === "Phòng Ngự"
        : item.type === selectedType);

    return (matchName || matchCharacter) && matchRarity && matchType;
  });

  const handleAddNew = () => {
    const newItem: SourceSoulHeart = {
      id: "",
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
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* KHI EDITING ITEM != NULL SẼ HIỆN MODAL */}
      {editingItem && (
        <AdminSourceSoulHeartModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={() => {
            fetchItems();
            setEditingItem(null);
          }}
          onDelete={async (id) => {
            if (!confirm("Bạn có chắc chắn muốn xóa Nguyên Hồn Tâm này?")) return;
            try {
              const res = await fetch(`/api/source-soul-hearts?id=${id}`, {
                method: "DELETE",
              });
              if (!res.ok) throw new Error("Failed to delete item");
              fetchItems();
              setEditingItem(null);
            } catch (error) {
              console.error(error);
              alert("Lỗi khi xóa Nguyên Hồn Tâm!");
            }
          }}
        />
      )}

      {/* HEADER SECTION */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-2.5 bg-blue-500/10 rounded-2xl ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                width="24"
                height="24"
                viewBox="0 0 55.000000 49.000000"
                preserveAspectRatio="xMidYMid meet"
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
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
              NGUYÊN HỒN TÂM
            </h2>
          </div>
          <p className="text-[11px] md:text-sm text-slate-500 ml-10 md:ml-14 font-medium">
            Quản lý vật phẩm Soul Heart • <span className="text-blue-400 font-bold">{filteredList.length}</span> / {items.length}
          </p>
        </div>

        {/* ACTIONS & FILTERS */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative group min-w-[200px] flex-1 xl:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <Input
              type="text"
              placeholder="Tìm tên hoặc nhân vật..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 backdrop-blur-md border-white/5 pl-11 pr-4 py-5 md:py-6 rounded-2xl text-xs md:text-sm focus-visible:ring-blue-500/50 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Rarity Select */}
            <Select value={selectedRarity} onValueChange={(val) => val && setSelectedRarity(val)}>
              <SelectTrigger className="flex-1 sm:w-[130px] bg-slate-900/40 backdrop-blur-md border-white/5 py-5 md:py-6 rounded-2xl text-xs md:text-sm text-slate-300 focus:ring-blue-500/50">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="opacity-40" />
                  <SelectValue placeholder="Hiếm" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/5 text-slate-300 rounded-xl">
                {rarities.map((r) => (
                  <SelectItem key={r} value={r} className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg m-1">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add Button */}
            <Button
              onClick={handleAddNew}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 md:px-8 py-5 md:py-6 rounded-2xl font-black text-[11px] md:text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-lg shadow-blue-900/30 transition-all active:scale-95 group"
            >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Thêm Mới
          </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-slate-900/30 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 p-5 flex flex-col items-center">
              <div className="w-full aspect-square bg-slate-800 rounded-2xl animate-pulse mb-4" />
              <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-slate-900 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 md:py-32 border-2 border-dashed border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/[0.01] backdrop-blur-sm mx-4"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 text-slate-700">
            <LayoutGrid size={32} />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">Không tìm thấy kết quả</h3>
          <p className="text-xs md:text-sm text-slate-500 mb-8 max-w-xs md:max-w-md mx-auto px-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc phẩm chất để tìm thấy thứ bạn cần.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRarity("Tất cả");
              setSelectedType("Tất cả");
            }}
            className="px-5 md:px-6 py-2.5 md:py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} /> Làm mới kết quả
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredList.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                className="group relative"
              >
                <div
                  onClick={() => setEditingItem(item)}
                  className={`relative aspect-[4/5] bg-slate-900/30 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 flex flex-col items-center p-4 md:p-5 transition-all hover:bg-white/[0.03] hover:border-white/10 hover:-translate-y-2 cursor-pointer shadow-2xl shadow-black/40`}
                >
                  {/* Background Glow Base */}
                  <div className={`absolute -bottom-10 -right-10 w-24 h-24 blur-3xl rounded-full opacity-10 pointer-events-none transition-opacity group-hover:opacity-30 ${
                    item.rarity === "SP" ? "bg-red-500" : item.rarity === "SSR+" ? "bg-orange-500" : "bg-blue-500"
                  }`} />

                  {/* Rarity Tag */}
                  <div className={`absolute top-3 md:top-4 right-3 md:right-4 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black z-10 border shadow-lg ${
                    item.rarity === "SP" 
                      ? "bg-red-600 border-red-400 text-white shadow-red-900/40" 
                      : item.rarity === "SSR+" 
                        ? "bg-amber-600 border-amber-400 text-white shadow-amber-900/40" 
                        : "bg-blue-600 border-blue-400 text-white shadow-blue-900/40"
                  }`}>
                    {item.rarity}
                  </div>

                  {/* Image Container */}
                  <div className="relative w-full aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-5 border-2 border-white/5 shadow-2xl group-hover:border-white/20 transition-all duration-500">
                    <img
                      src={optimizeCloudinary(item.avatar, 200) || item.avatar}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 md:pb-4">
                      <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">Edit <ArrowRightCircle size={12} /></span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="w-full space-y-1 relative z-10">
                    <h3 className="font-black text-[11px] md:text-sm text-center text-white line-clamp-1 w-full group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 md:gap-2">
                       <p className="text-[9px] md:text-[10px] text-slate-500 font-bold text-center truncate italic max-w-[50%]">
                        {item.character}
                      </p>
                      <span className="w-1 h-1 bg-slate-700 rounded-full" />
                       <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">
                        {item.type}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
