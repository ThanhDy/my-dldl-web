"use client";

import React, { useState, useEffect } from "react";
import { Crosshair, Save, Shield, Sword, Sparkles, AlertCircle, Upload, RefreshCw, Star, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { KhacAnSystem, KhacAnSet, KhacAnPiece } from "@/data/types";
import { KhacAnHonCotIcon } from "@/app/components/Icons";

const TABS = [
  { id: "cuong-man", label: "Cường Công - Mẫn Công", icon: Sword },
  { id: "ho-tro", label: "Hỗ Trợ", icon: Shield },
  { id: "khong-che", label: "Khống Chế", icon: Sparkles },
  { id: "sp", label: "Khắc Ấn SP", icon: Star }
];

const DEFAULT_PIECES = [
  { id: "main", name: "", image: "", descriptionPVP: "", descriptionPVE: "" },
  { id: "sub1", name: "", image: "", descriptionPVP: "", descriptionPVE: "" },
  { id: "sub2", name: "", image: "", descriptionPVP: "", descriptionPVE: "" },
  { id: "sub3", name: "", image: "", descriptionPVP: "", descriptionPVE: "" },
  { id: "sub4", name: "", image: "", descriptionPVP: "", descriptionPVE: "" },
  { id: "sub5", name: "", image: "", descriptionPVP: "", descriptionPVE: "" },
];

const DEFAULT_SETS = [1, 2, 3, 4].map(num => ({
  setId: num,
  name: `Bộ Khắc Ấn ${num}`,
  description: "",
  pieces: JSON.parse(JSON.stringify(DEFAULT_PIECES))
}));

interface Props {
  initialData: KhacAnSystem[];
}

export default function AdminKhacAnClient({ initialData }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [data, setData] = useState<KhacAnSystem[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState<{ setId: number, pieceId: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCurrentSystem = (): KhacAnSystem => {
    const existing = data.find(s => s.id === activeTab);
    if (existing) return existing;
    return {
      id: activeTab,
      type: TABS.find(t => t.id === activeTab)?.label || "",
      sets: activeTab === "sp" ? [{ setId: 1, name: "Danh sách Khắc Ấn SP", pieces: [] }] : JSON.parse(JSON.stringify(DEFAULT_SETS)) as KhacAnSet[]
    };
  };

  const currentSystem = getCurrentSystem();

  const handleUpdatePiece = (setId: number, pieceId: string, field: keyof KhacAnPiece, value: string) => {
    const newData = [...data];
    let systemIndex = newData.findIndex(s => s.id === activeTab);
    
    if (systemIndex === -1) {
      newData.push({
        id: activeTab,
        type: TABS.find(t => t.id === activeTab)?.label || "",
        sets: JSON.parse(JSON.stringify(DEFAULT_SETS))
      });
      systemIndex = newData.length - 1;
    }

    const setIndex = newData[systemIndex].sets.findIndex(s => s.setId === setId);
    if (setIndex !== -1) {
      const pieceIndex = newData[systemIndex].sets[setIndex].pieces.findIndex(p => p.id === pieceId);
      if (pieceIndex !== -1) {
        newData[systemIndex].sets[setIndex].pieces[pieceIndex] = {
          ...newData[systemIndex].sets[setIndex].pieces[pieceIndex],
          [field]: value
        };
        setData(newData);
      }
    }
  };

  const handleUpdateSetField = (setId: number, field: keyof KhacAnSet, value: string) => {
    const newData = [...data];
    let systemIndex = newData.findIndex(s => s.id === activeTab);
    
    if (systemIndex === -1) {
      newData.push({
        id: activeTab,
        type: TABS.find(t => t.id === activeTab)?.label || "",
        sets: JSON.parse(JSON.stringify(DEFAULT_SETS))
      });
      systemIndex = newData.length - 1;
    }

    const setIndex = newData[systemIndex].sets.findIndex(s => s.setId === setId);
    if (setIndex !== -1) {
      newData[systemIndex].sets[setIndex] = {
        ...newData[systemIndex].sets[setIndex],
        [field]: value
      };
      setData(newData);
    }
  };

  const handleAddSpItem = () => {
    const newData = [...data];
    let systemIndex = newData.findIndex(s => s.id === "sp");
    
    if (systemIndex === -1) {
      newData.push({
        id: "sp",
        type: "Khắc Ấn SP",
        sets: [{ setId: 1, name: "Danh sách Khắc Ấn SP", pieces: [] }]
      });
      systemIndex = newData.length - 1;
    }

    const newPiece: KhacAnPiece = {
      id: `sp-${Date.now()}`,
      name: "",
      image: "",
      descriptionPVP: "",
      descriptionPVE: ""
    };

    newData[systemIndex].sets[0].pieces.push(newPiece);
    setData(newData);
  };

  const handleRemoveSpItem = (pieceId: string) => {
    const newData = [...data];
    const systemIndex = newData.findIndex(s => s.id === "sp");
    if (systemIndex !== -1) {
      newData[systemIndex].sets[0].pieces = newData[systemIndex].sets[0].pieces.filter(p => p.id !== pieceId);
      setData(newData);
    }
  };

  const uploadToCloudinary = async (file: File, setId: number, pieceId: string) => {
    setUploading({ setId, pieceId });
    const dataForm = new FormData();
    dataForm.append("file", file);
    dataForm.append("folder", "khac-an-hon-cot");

    try {
      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: dataForm,
      });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      
      handleUpdatePiece(setId, pieceId, "image", result.secure_url);
    } catch (error) {
      alert("Lỗi upload ảnh!");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/khac-an-hon-cot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSystem)
      });

      if (!response.ok) {
        throw new Error(`Mã lỗi HTTP: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        alert("Lưu dữ liệu danh mục thành công!");
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error: any) {
      console.error("Lưu dữ liệu thất bại:", error);
      alert("Lỗi khi kết nối đến server: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return <div className="p-4 md:p-8 space-y-6 min-h-screen" />;

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-2.5 bg-emerald-500/10 rounded-2xl ring-1 ring-emerald-500/20">
            <KhacAnHonCotIcon className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
              Quản Lý Khắc Ấn
            </h2>
            <p className="text-[11px] md:text-sm text-slate-500 font-medium">
              Nhập liệu cho các bộ khắc ấn theo danh mục
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 md:px-8 py-4 rounded-2xl font-black text-[11px] md:text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Đang lưu..." : "Lưu Danh Mục Này"}
        </button>
      </header>

      {/* Tabs Danh Mục */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/50 border border-white/5 rounded-2xl backdrop-blur-md w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

     

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {activeTab === "sp" ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={handleAddSpItem} className="bg-yellow-600 hover:bg-yellow-500 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-yellow-900/20">
                  <Plus size={16} /> Thêm Khắc Ấn SP Mới
                </button>
              </div>
              
              {currentSystem.sets[0]?.pieces.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-slate-500 font-bold uppercase tracking-widest">
                  Chưa có Khắc Ấn SP nào. Hãy thêm mới!
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentSystem.sets[0]?.pieces.map(piece => (
                    <div key={piece.id} className="p-6 rounded-[2rem] border bg-slate-900/40 border-white/5 space-y-5 relative group hover:border-yellow-500/30 transition-colors">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2 text-[11px] uppercase font-black tracking-widest text-yellow-500">
                          <Star size={14} className="text-yellow-500"/>
                          <span>Khắc Ấn SP</span>
                        </div>
                        <button onClick={() => handleRemoveSpItem(piece.id)} className="text-slate-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold">Tên Khắc Ấn</label>
                          <input type="text" placeholder="VD: Khắc Ấn Thái Thản..." value={piece.name} onChange={(e) => handleUpdatePiece(1, piece.id, "name", e.target.value)} className="w-full mt-1.5 bg-slate-950/50 border border-white/5 rounded-xl p-2.5 text-sm text-white outline-none focus:border-yellow-500/50" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold">Hình Ảnh (URL)</label>
                          <div className="flex gap-2 mt-1.5">
                            <input type="text" placeholder="Link ảnh..." value={piece.image} onChange={(e) => handleUpdatePiece(1, piece.id, "image", e.target.value)} className="flex-1 w-full bg-slate-950/50 border border-white/5 rounded-xl p-2.5 text-sm text-white outline-none focus:border-yellow-500/50" />
                            <label className="bg-white/5 border border-white/10 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30 text-slate-400 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center shrink-0">
                               {uploading?.setId === 1 && uploading?.pieceId === piece.id ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
                               <input type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) uploadToCloudinary(e.target.files[0], 1, piece.id); }} />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold text-orange-400">Mô tả PVE</label>
                          <textarea placeholder="Mô tả cho PVE..." value={piece.descriptionPVE} onChange={(e) => handleUpdatePiece(1, piece.id, "descriptionPVE", e.target.value)} className="w-full mt-1.5 h-24 bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-orange-500/50 resize-none custom-scrollbar" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold text-blue-400">Mô tả PVP</label>
                          <textarea placeholder="Mô tả cho PVP..." value={piece.descriptionPVP} onChange={(e) => handleUpdatePiece(1, piece.id, "descriptionPVP", e.target.value)} className="w-full mt-1.5 h-24 bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-blue-500/50 resize-none custom-scrollbar" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            currentSystem.sets.map((set: KhacAnSet) => (
            <div key={set.setId} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <h3 className="font-black text-xl text-emerald-400 uppercase tracking-tighter italic">
                  {set.name || `Bộ Khắc Ấn ${set.setId}`}
                </h3>
                <div className="flex items-center gap-3">
                  <label className="text-[10px] text-slate-500 uppercase font-bold whitespace-nowrap">Đổi Tên Bộ</label>
                  <input 
                    type="text"
                    placeholder={`VD: Cốt Ngữ...`} 
                    value={set.name}
                    onChange={(e) => handleUpdateSetField(set.setId, "name", e.target.value)}
                    className="bg-slate-950/50 border border-white/5 rounded-xl p-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50 w-full md:w-64" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold text-emerald-400">Mô tả cả bộ</label>
                  <textarea 
                    placeholder="Mô tả chung cho cả bộ..." 
                    value={set.description || ""}
                    onChange={(e) => handleUpdateSetField(set.setId, "description", e.target.value)}
                    className="w-full mt-1 h-20 bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 resize-none" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {set.pieces.map((piece: KhacAnPiece) => {
                  const isMain = piece.id === 'main';
                  return (
                    <div key={piece.id} className={`p-5 rounded-2xl border ${isMain ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/20 border-white/5'} space-y-4`}>
                      <div className="flex items-center gap-2 text-[11px] uppercase font-black tracking-widest text-slate-400">
                        {isMain ? <Sparkles size={14} className="text-emerald-500"/> : null}
                        <span className={isMain ? "text-emerald-500" : ""}>
                          {isMain ? "Viên Chủ" : `Viên Phụ ${piece.id.replace('sub', '')}`}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold">Tên Viên Mới</label>
                          <input 
                            type="text"
                            placeholder="VD: Cốt Ngữ·Hồn..." 
                            value={piece.name}
                            onChange={(e) => handleUpdatePiece(set.setId, piece.id, "name", e.target.value)}
                            className="w-full mt-1 bg-slate-950/50 border border-white/5 rounded-xl p-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold">Hình Ảnh (URL)</label>
                          <div className="flex gap-2 mt-1">
                            <input 
                              type="text"
                              placeholder="Link ảnh..." 
                              value={piece.image}
                              onChange={(e) => handleUpdatePiece(set.setId, piece.id, "image", e.target.value)}
                              className="flex-1 w-full bg-slate-950/50 border border-white/5 rounded-xl p-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50" 
                            />
                            <label className="bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 text-slate-400 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center shrink-0">
                               {uploading?.setId === set.setId && uploading?.pieceId === piece.id ? (
                                  <RefreshCw size={16} className="animate-spin" />
                               ) : (
                                  <Upload size={16} />
                               )}
                               <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                 if (e.target.files?.[0]) uploadToCloudinary(e.target.files[0], set.setId, piece.id);
                               }} />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold text-orange-400">Mô tả PVE</label>
                          <textarea 
                            placeholder="Mô tả cho PVE..." 
                            value={piece.descriptionPVE}
                            onChange={(e) => handleUpdatePiece(set.setId, piece.id, "descriptionPVE", e.target.value)}
                            className="w-full mt-1 h-20 bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 resize-none" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-bold text-blue-400">Mô tả PVP</label>
                          <textarea 
                            placeholder="Mô tả cho PVP..." 
                            value={piece.descriptionPVP}
                            onChange={(e) => handleUpdatePiece(set.setId, piece.id, "descriptionPVP", e.target.value)}
                            className="w-full mt-1 h-20 bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 resize-none" 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}