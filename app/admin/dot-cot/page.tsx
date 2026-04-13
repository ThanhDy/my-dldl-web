"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Save, 
  ArrowLeft,
  ChevronRight,
  Flame,
  Info,
  RefreshCw,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { BoneBurning, BoneBurningLevel } from "@/data/types";
import { motion, AnimatePresence } from "framer-motion";

const BONE_TYPES = ["Cường Công", "Mẫn Công", "Khống Chế", "Phụ Trợ/Phòng Ngự"];
const DEFAULT_LEVELS: BoneBurningLevel[] = [
  { level: 1, levelName: "Cấp 1", description: "" },
  { level: 2, levelName: "Cấp 2", description: "" },
  { level: 3, levelName: "Cấp 3", description: "" },
  { level: 4, levelName: "Cấp 4", description: "" },
  { level: 5, levelName: "Cấp 5", description: "" },
  { level: 6, levelName: "Cấp 6", description: "" },
  { level: 7, levelName: "Tiến hóa", description: "" },
];

export default function AdminBoneBurning() {
  const [selectedType, setSelectedType] = useState(BONE_TYPES[0]);
  const [levels, setLevels] = useState<BoneBurningLevel[]>(DEFAULT_LEVELS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bone-burning");
      const result = await res.json();
      if (result.success) {
        const existing = result.data.find((item: BoneBurning) => item.type === selectedType);
        if (existing) {
          setLevels(existing.levels);
        } else {
          setLevels(DEFAULT_LEVELS.map(l => ({ ...l, description: "" })));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/bone-burning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          levels: levels
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Lưu thành công!");
      } else {
        alert("Lỗi: " + result.error);
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    } finally {
      setSaving(false);
    }
  };

  const updateLevelDescription = (index: number, desc: string) => {
    const newLevels = [...levels];
    newLevels[index].description = desc;
    setLevels(newLevels);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <Link href="/admin" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} className="text-slate-400" />
            </Link>
            <div className="p-2.5 bg-orange-500/10 rounded-2xl ring-1 ring-orange-500/20 shadow-lg shadow-orange-500/5">
              <Flame className="text-orange-400" size={24} />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
              Quản Lý Hệ Thống Đốt Cốt
            </h2>
          </div>
          <p className="text-[11px] md:text-sm text-slate-500 ml-10 md:ml-14 font-medium">
            Thiết lập các mốc cấp độ và mô tả kỹ năng cho từng hệ hồn sư.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
             <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full xl:w-auto bg-orange-600 hover:bg-orange-500 text-white px-8 py-6 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-orange-900/30 transition-all active:scale-95 group"
            >
              {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              Lưu Thay Đổi
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar - Types */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-2">Chọn Hệ</h3>
          <div className="grid grid-cols-1 gap-2">
            {BONE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`
                  flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group
                  ${selectedType === type 
                    ? "bg-orange-500/10 border-orange-500/30 text-white" 
                    : "bg-slate-900/40 border-white/5 text-slate-500 hover:bg-white/5 hover:border-white/10"
                  }
                `}
              >
                <span className={`font-bold text-sm ${selectedType === type ? "text-orange-400" : ""}`}>{type}</span>
                <ChevronRight size={16} className={`transition-transform duration-300 ${selectedType === type ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content - Levels */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8 shadow-2xl">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                <h4 className="text-xl font-bold text-white italic">Cấu hình: <span className="text-orange-400 uppercase tracking-tighter not-italic">{selectedType}</span></h4>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                <RefreshCw className="animate-spin" size={32} />
                <p className="font-bold text-xs uppercase tracking-widest">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {levels.map((level, index) => (
                  <div key={level.level} className="space-y-4 group/item">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black
                        ${level.level === 7 ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" : "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20"}
                      `}>
                        {level.level}
                      </div>
                      <h5 className="font-black text-white italic uppercase tracking-wider">{level.levelName}</h5>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        value={level.description}
                        onChange={(e) => updateLevelDescription(index, e.target.value)}
                        placeholder={`Nhập mô tả kỹ năng cho ${level.levelName}...`}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-slate-300 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all min-h-[120px] custom-scrollbar"
                      />
                      <div className="absolute top-4 right-4 text-[9px] font-black text-slate-700 uppercase tracking-widest pointer-events-none group-focus-within/item:text-orange-900 transition-colors">
                        Description
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-6 px-4 py-2 opacity-50 flex-wrap">
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <Info size={12} /> Dùng định dạng [color|text] để tô màu văn bản
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-800" />
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <Zap size={12} /> Tự động đồng bộ với cơ sở dữ liệu
          </div>
      </div>
    </div>
  );
}
