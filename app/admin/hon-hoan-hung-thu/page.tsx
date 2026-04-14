"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Save,
  X,
  Upload,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { HungThuSoulRing, HungThuSystem, HungThuType, HungThuYearEffect } from "@/data/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const SYSTEMS: HungThuSystem[] = ["Cường Công", "Mẫn Công", "Khống Chế", "Phụ Trợ/Phòng Ngự"];
const SYSTEMS_FILTER = ["Cường/Mẫn", "Khống Chế", "Phụ Trợ/Phòng Ngự"];
const TYPES: { label: string; value: HungThuType }[] = [
  { label: "Thường", value: "Regular" },
  { label: "Kết Hợp", value: "Combined" }
];

export default function AdminHungThuSoulRing() {
  const [data, setData] = useState<HungThuSoulRing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<HungThuSoulRing> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSystem, setFilterSystem] = useState<string>("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hung-thu-soul-ring");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: Partial<HungThuSoulRing> | null = null) => {
    if (item) {
      // Đảm bảo systems luôn là mảng khi edit (đề phòng dữ liệu cũ)
      setEditingItem({
        ...item,
        systems: item.systems || ((item as any).system ? [(item as any).system] : ["Cường Công"])
      });
      setPreviewUrl(item.image || "");
    } else {
      setEditingItem({
        name: "",
        image: "",
        systems: ["Cường Công"],
        type: "Regular",
        basicEffect: "",
        yearEffects: [{ year: "", effect: "" }],
        componentIds: [],
        suitableWithId: undefined
      });
      setPreviewUrl("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setPreviewUrl("");
  };

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    const dataForm = new FormData();
    dataForm.append("file", file);
    dataForm.append("folder", "hung-thu-soul-rings");

    try {
      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: dataForm,
      });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      setPreviewUrl(result.secure_url);
      setEditingItem(prev => prev ? { ...prev, image: result.secure_url } : null);
    } catch (error) {
      alert("Lỗi upload ảnh!");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem?.name || !editingItem?.image || !editingItem?.basicEffect) {
      alert("Vui lòng nhập đầy đủ thông tin cơ bản!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/hung-thu-soul-ring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const result = await res.json();
      if (result.success) {
        handleCloseModal();
        fetchData();
      } else {
        alert("Lỗi: " + result.error);
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      const res = await fetch(`/api/hung-thu-soul-ring/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  const addYearEffect = () => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        yearEffects: [...(editingItem.yearEffects || []), { year: "", effect: "" }]
      });
    }
  };

  const removeYearEffect = (index: number) => {
    if (editingItem) {
      const newEffects = [...(editingItem.yearEffects || [])];
      newEffects.splice(index, 1);
      setEditingItem({ ...editingItem, yearEffects: newEffects });
    }
  };

  const updateYearEffect = (index: number, field: keyof HungThuYearEffect, value: string) => {
    if (editingItem) {
      const newEffects = [...(editingItem.yearEffects || [])];
      newEffects[index][field] = value;
      setEditingItem({ ...editingItem, yearEffects: newEffects });
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Logic lọc hệ
    let matchesSystem = false;
    if (filterSystem === "All") {
      matchesSystem = true;
    } else if (filterSystem === "Cường/Mẫn") {
      // Khớp nếu CÓ BẤT KỲ hệ nào là Cường Công HOẶC Mẫn Công
      matchesSystem = item.systems?.some(s => s === "Cường Công" || s === "Mẫn Công") ?? false;
    } else {
      matchesSystem = item.systems?.includes(filterSystem as any) ?? false;
    }

    return matchesSearch && matchesSystem;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <Link href="/admin" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} className="text-slate-400" />
            </Link>
            <div className="p-2.5 bg-orange-500/10 rounded-2xl ring-1 ring-orange-500/20 shadow-lg shadow-orange-500/5">
              <Zap className="text-orange-400" size={24} />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
              Quản Lý Hồn Hoàn Hung Thú
            </h2>
          </div>
          <p className="text-[11px] md:text-sm text-slate-500 ml-10 md:ml-14 font-medium">
            Thiết lập dữ liệu cho các loại hồn hoàn hung thú và thuộc tính kết hợp.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
             <Button 
              onClick={() => handleOpenModal()} 
              className="w-full xl:w-auto bg-orange-600 hover:bg-orange-500 text-white px-8 py-6 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-orange-900/30 transition-all active:scale-95 group"
            >
              <Plus size={18} />
              Thêm Hồn Hoàn Mới
            </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Tìm kiếm tên hồn hoàn..." 
            className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-orange-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 flex flex-wrap items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] overflow-x-auto scroll-hide">
          <button
            onClick={() => setFilterSystem("All")}
            className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
              filterSystem === "All" 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            Tất cả hệ
          </button>
          {SYSTEMS_FILTER.map(sys => (
            <button
              key={sys}
              onClick={() => setFilterSystem(sys)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                filterSystem === sys 
                  ? "bg-white/10 text-orange-400 border border-white/10" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {sys}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Hồn Hoàn</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Hệ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Loại</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500 italic">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500 italic">Không tìm thấy hồn hoàn nào</td>
                </tr>
              ) : filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{item.basicEffect}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {item.systems?.map(s => (
                        <span key={s} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[9px] font-bold border border-white/5 whitespace-nowrap">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      item.type === "Combined" 
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {item.type === "Combined" ? "Kết Hợp" : "Thường"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                  {editingItem.id ? "Chỉnh sửa" : "Thêm mới"} Hồn hoàn
                </h3>
                <button onClick={handleCloseModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: General Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Ảnh Hồn Hoàn</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 group">
                        {previewUrl ? (
                          <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700">
                             <ImageIcon size={32} />
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                            <RefreshCw className="animate-spin text-white" size={20} />
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                           <Upload size={20} className="text-white" />
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0])} />
                        </label>
                      </div>
                      <div className="flex-1 space-y-2">
                         <Input 
                          placeholder="Hoặc nhập URL ảnh..." 
                          className="bg-white/5 border-white/10"
                          value={editingItem.image || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        />
                         <p className="text-[9px] text-slate-500 italic">* Ưu tiên tải ảnh lên để có tốc độ tải ổn định nhất.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Tên Hồn Hoàn</label>
                    <Input 
                      className="bg-white/5 border-white/10 h-12 text-white font-bold"
                      value={editingItem.name || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Các hệ áp dụng</label>
                      <div className="grid grid-cols-2 gap-2">
                        {SYSTEMS.map(s => {
                          const isSelected = editingItem.systems?.includes(s);
                          return (
                            <button
                              key={s}
                              onClick={() => {
                                const current = editingItem.systems || [];
                                if (isSelected) {
                                  if (current.length > 1) {
                                    setEditingItem({ ...editingItem, systems: current.filter(x => x !== s) });
                                  }
                                } else {
                                  setEditingItem({ ...editingItem, systems: [...current, s] });
                                }
                              }}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                                isSelected 
                                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400" 
                                  : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Loại hồn hoàn</label>
                      <select 
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-slate-300 outline-none"
                        value={editingItem.type}
                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as HungThuType })}
                      >
                        {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Hiệu ứng cơ bản</label>
                    <textarea 
                      className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 focus:border-orange-500/50 outline-none"
                      value={editingItem.basicEffect || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, basicEffect: e.target.value })}
                    />
                  </div>

                  {editingItem.type === "Combined" ? (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 pl-1">Hồn Hoàn Thành Phần (Chọn 2)</label>
                       <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto px-1">
                          {data.filter(d => d.type === "Regular" && d.id !== editingItem.id).map(r => {
                            const isSelected = editingItem.componentIds?.includes(r.id);
                            return (
                              <button 
                                key={r.id}
                                onClick={() => {
                                  const currentIds = editingItem.componentIds || [];
                                  if (isSelected) {
                                    setEditingItem({ ...editingItem, componentIds: currentIds.filter(id => id !== r.id) });
                                  } else {
                                    if (currentIds.length < 2) {
                                      setEditingItem({ ...editingItem, componentIds: [...currentIds, r.id] });
                                    }
                                  }
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                  isSelected ? "bg-orange-500/10 border-orange-500/30 text-white" : "bg-white/5 border-white/5 text-slate-500"
                                }`}
                              >
                                <div className="w-6 h-6 rounded-md overflow-hidden relative border border-white/10">
                                   <Image src={r.image} alt="" fill className="object-cover" unoptimized />
                                </div>
                                <span className="text-xs font-bold">{r.name}</span>
                              </button>
                            );
                          })}
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-blue-500/60 pl-1">Hồn Hoàn Kết Hợp Cùng (Tùy chọn)</label>
                       <select 
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-slate-300 outline-none"
                        value={editingItem.suitableWithId || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, suitableWithId: e.target.value || undefined })}
                      >
                        <option value="">Không có</option>
                        {data.filter(d => d.type === "Regular" && d.id !== editingItem.id).map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Right Side: Year Effects */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Hiệu ứng theo mốc năm</label>
                    <button 
                      onClick={addYearEffect}
                      className="text-[10px] font-black uppercase text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      <Plus size={12} /> Thêm mốc
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {editingItem.yearEffects?.map((eff, index) => (
                      <div key={index} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3 relative group/eff">
                         <div className="flex gap-4">
                            <Input 
                              placeholder="VD: 10 Vạn năm" 
                              className="bg-white/5 border-white/10 w-1/3"
                              value={eff.year}
                              onChange={(e) => updateYearEffect(index, "year", e.target.value)}
                            />
                            <button 
                              onClick={() => removeYearEffect(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/eff:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                         </div>
                         <textarea 
                          className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 focus:border-orange-500/50 outline-none"
                          placeholder="Mô tả hiệu ứng cho mốc năm này..."
                          value={eff.effect}
                          onChange={(e) => updateYearEffect(index, "effect", e.target.value)}
                        />
                      </div>
                    ))}
                    {editingItem.yearEffects?.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        Chưa có mốc năm nào
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex justify-end gap-3">
                 <Button 
                  onClick={handleCloseModal}
                  className="bg-white/5 hover:bg-white/10 text-slate-400 px-8 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                  Lưu dữ liệu
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.3);
        }
      `}</style>
    </div>
  );
}
