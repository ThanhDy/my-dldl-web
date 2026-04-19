"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Save,
  X,
  Upload,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { HonDaoKhi, HonDaoKhiStarEffect } from "@/data/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AdminHonDaoKhi() {
  const [data, setData] = useState<HonDaoKhi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<HonDaoKhi> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hon-dao-khi");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleManualRevalidate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/revalidate?path=/hon-dao-khi");
      const result = await res.json();
      if (result.revalidated) {
        alert("Đã làm mới bộ nhớ đệm trang người dùng!");
      } else {
        alert("Lỗi khi làm mới: " + result.message);
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: Partial<HonDaoKhi> | null = null) => {
    if (item) {
      setEditingItem({ ...item });
      setPreviewUrl(item.image || "");
    } else {
      setEditingItem({
        name: "",
        image: "",
        starEffects: [{ starLevel: "1 Sao Đỏ", effect: "" }]
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
    dataForm.append("folder", "hon-dao-khi");

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
    if (!editingItem?.name) {
      alert("Vui lòng nhập tên hồn đạo khí!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/hon-dao-khi", {
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
      const res = await fetch(`/api/hon-dao-khi/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  const addStarEffect = () => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        starEffects: [...(editingItem.starEffects || []), { starLevel: "", effect: "" }]
      });
    }
  };

  const removeStarEffect = (index: number) => {
    if (editingItem) {
      const newEffects = [...(editingItem.starEffects || [])];
      newEffects.splice(index, 1);
      setEditingItem({ ...editingItem, starEffects: newEffects });
    }
  };

  const updateStarEffect = (index: number, field: keyof HonDaoKhiStarEffect, value: string) => {
    if (editingItem) {
      const newEffects = [...(editingItem.starEffects || [])];
      newEffects[index][field] = value;
      setEditingItem({ ...editingItem, starEffects: newEffects });
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <Link href="/admin" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} className="text-slate-400" />
            </Link>
            <div className="p-2.5 bg-blue-500/10 rounded-2xl ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/5">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
              Quản Lý Hồn Đạo Khí
            </h2>
          </div>
          <p className="text-[11px] md:text-sm text-slate-500 ml-10 md:ml-14 font-medium">
            Thiết lập danh sách và hiệu ứng các mốc sao cho Hồn Đạo Khí.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
             <button
                onClick={handleManualRevalidate}
                disabled={loading}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all border border-slate-700 text-sm"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Làm mới Cache User
              </button>
             <Button 
              onClick={() => handleOpenModal()} 
              className="w-full xl:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-900/30 transition-all active:scale-95 group"
            >
              <Plus size={18} />
              Thêm Hồn Đạo Khí
            </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Tìm kiếm tên hồn đạo khí..." 
            className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Hồn Đạo Khí</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Các Mốc Sao</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-slate-500 italic">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-slate-500 italic">Không tìm thấy hồn đạo khí nào</td>
                </tr>
              ) : filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                        {item.image ? (
                           <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-700">
                             <ImageIcon size={20} />
                           </div>
                        )}
                      </div>
                      <div className="font-bold text-white text-sm">{item.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {item.starEffects?.map((s, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[9px] font-bold border border-white/5 whitespace-nowrap">
                          {s.starLevel}
                        </span>
                      ))}
                    </div>
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
                  {editingItem.id ? "Chỉnh sửa" : "Thêm mới"} Hồn Đạo Khí
                </h3>
                <button onClick={handleCloseModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: General Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Ảnh Hồn Đạo Khí</label>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Tên Hồn Đạo Khí</label>
                    <Input 
                      className="bg-white/5 border-white/10 h-12 text-white font-bold"
                      value={editingItem.name || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Right Side: Star Effects */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Hiệu ứng theo mốc sao</label>
                    <button 
                      onClick={addStarEffect}
                      className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Plus size={12} /> Thêm mốc sao
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {editingItem.starEffects?.map((eff, index) => (
                      <div key={index} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3 relative group/eff">
                         <div className="flex gap-4">
                            <Input 
                              placeholder="VD: 1 Sao Đỏ" 
                              className="bg-white/5 border-white/10 w-1/3"
                              value={eff.starLevel}
                              onChange={(e) => updateStarEffect(index, "starLevel", e.target.value)}
                            />
                            <button 
                              onClick={() => removeStarEffect(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/eff:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                         </div>
                         <textarea 
                          className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 focus:border-blue-500/50 outline-none"
                          placeholder="Mô tả hiệu ứng cho mốc sao này..."
                          value={eff.effect}
                          onChange={(e) => updateStarEffect(index, "effect", e.target.value)}
                        />
                      </div>
                    ))}
                    {editingItem.starEffects?.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        Chưa có mốc sao nào
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
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2"
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
          background: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}
