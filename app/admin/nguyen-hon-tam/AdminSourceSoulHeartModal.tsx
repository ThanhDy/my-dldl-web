"use client";

import { useState, useRef } from "react";
import { 
  Edit3, 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  Zap,
  Star,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SourceSoulHeart, starEffect } from "@/data/types";
import { cn } from "@/lib/utils";

const soulMasterTypes = [
  "Cường Công",
  "Mẫn Công",
  "Khống Chế",
  "Phụ Trợ",
  "Phòng Ngự",
];

const rarityColors: Record<string, string> = {
  "SP+": "from-red-500 to-amber-500 shadow-red-500/20",
  "SP": "from-purple-500 to-red-500 shadow-purple-500/20",
  "SSR+": "from-amber-400 to-orange-600 shadow-amber-500/20",
  "SSR": "from-blue-500 to-indigo-600 shadow-blue-500/20",
};

export default function AdminSourceSoulHeartModal({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: SourceSoulHeart;
  onClose: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}) {
  const [formData, setFormData] = useState<SourceSoulHeart>(item);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(item.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStarEffectChange = (
    index: number,
    field: keyof starEffect,
    value: string | number,
  ) => {
    const newStarEffects = [...(formData.starEffects || [])];
    newStarEffects[index] = {
      ...newStarEffects[index],
      [field]:
        field === "star" || field === "condition" ? Number(value) : value,
    };
    setFormData((prev) => ({ ...prev, starEffects: newStarEffects }));
  };

  const addStarEffect = () => {
    setFormData((prev) => ({
      ...prev,
      starEffects: [
        ...(prev.starEffects || []),
        { star: 0, condition: 0, description: "" },
      ],
    }));
  };

  const removeStarEffect = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      starEffects: (prev.starEffects || []).filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const deleteCloudinaryImage = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;

    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/;
    const match = imageUrl.match(regex);
    if (match && match[1]) {
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        body: JSON.stringify({ public_id: match[1] }),
      });
    }
  };

  const uploadToCloudinary = async (file: File, folderName: string) => {
    const dataForm = new FormData();
    dataForm.append("file", file);
    if (folderName) {
      dataForm.append("folder", folderName);
    }

    const res = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: dataForm,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Lỗi khi upload ảnh lên server!");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      let finalAvatarUrl = formData.avatar;

      if (imageFile) {
        const newUrl = await uploadToCloudinary(imageFile, "nguyen-hon-tam");
        if (newUrl) {
          if (formData.avatar) {
            await deleteCloudinaryImage(formData.avatar);
          }
          finalAvatarUrl = newUrl;
        }
      }

      const finalData = { ...formData, avatar: finalAvatarUrl };

      const mongoRes = await fetch("/api/source-soul-hearts", {
        method: item.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const savedData = await mongoRes.json();

      if (!mongoRes.ok) {
        throw new Error(
          savedData.error || "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu",
        );
      }

      onSave();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Đã xảy ra lỗi trong quá trình lưu");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-900/90 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5"
        >
          {/* Decorative Background Glows */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Modal */}
          <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-white/[0.02]">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl ring-1 ring-blue-500/20">
                  <Edit3 className="text-blue-400" size={20} />
                </div>
                Chỉnh Sửa Nguyên Hồn Tâm
              </h3>
              <p className="text-xs text-slate-400 mt-1 ml-11">Cập nhật thông tin chi tiết và hiệu ứng kỹ năng</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-white/5 transition-all p-2 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body Modal (Form) */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Core Info */}
              <div className="space-y-6">
                {/* ID (Readonly) */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="12"
                      height="12"
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
                     ID Định Danh
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.id}
                      disabled
                      className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed italic"
                    />
                  </div>
                </div>

                {/* Tên Nguyên Hồn Tâm */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    <Sparkles size={12} className="text-blue-400" /> Tên Nguyên Hồn Tâm
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-xl p-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 shadow-inner"
                    placeholder="Nhập tên..."
                  />
                </div>

                {/* Tên Nhân Vật */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    <Edit3 size={12} className="text-purple-400" /> Tên Nhân Vật
                  </label>
                  <input
                    type="text"
                    name="character"
                    value={formData.character}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 rounded-xl p-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 shadow-inner"
                    placeholder="Nhập tên nhân vật..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Độ hiếm */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Độ Hiếm
                    </label>
                    <div className="relative">
                      <select
                        name="rarity"
                        value={formData.rarity}
                        onChange={handleChange}
                        className="w-full appearance-none bg-slate-950/50 border border-white/10 focus:border-blue-500/50 rounded-xl p-3 text-sm text-white outline-none transition-all cursor-pointer shadow-inner"
                      >
                        <option value="SP">SP</option>
                        <option value="SSR+">SSR+</option>
                        <option value="SSR">SSR</option>
                      </select>
                      <div className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[10px] font-black bg-gradient-to-br shadow-sm",
                        rarityColors[formData.rarity] || "from-slate-500 to-slate-700"
                      )}>
                        {formData.rarity}
                      </div>
                    </div>
                  </div>

                  {/* Hệ */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Hệ
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-white/10 focus:border-blue-500/50 rounded-xl p-3 text-sm text-white outline-none transition-all shadow-inner"
                    >
                      {soulMasterTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Avatar & Advanced */}
              <div className="space-y-6">
                {/* Ảnh Avatar Section */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    <ImageIcon size={12} className="text-emerald-400" /> Hình Ảnh Hiển Thị
                  </label>
                  <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-4">
                    <div className="group relative">
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={previewImage || formData.avatar || "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="relative w-32 h-32 rounded-2xl object-cover border-2 border-white/10 bg-slate-800 shadow-2xl transition-transform group-hover:scale-105 duration-300"
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-90"
                      >
                        <Upload size={16} />
                      </button>
                    </div>
                    
                    <div className="w-full space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <div className="relative">
                        <input
                          type="text"
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleChange}
                          placeholder="Hoặc dán URL hình ảnh..."
                          className="w-full bg-slate-950/50 border border-white/10 focus:border-blue-500/50 rounded-xl p-2.5 text-[11px] text-slate-400 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* T.Tính Cơ Bản */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Thuộc Tính Cơ Bản
                  </label>
                  <input
                    type="text"
                    name="basicStat"
                    value={formData.basicStat}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/10 focus:border-blue-500/50 rounded-xl p-3 text-sm text-blue-400 font-medium outline-none transition-all shadow-inner"
                    placeholder="+100 Kháng, +50% Công..."
                  />
                </div>
              </div>
            </div>

            {/* Chi tiết kỹ năng - Full Width */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  <Layers size={12} className="text-amber-400" /> Chi Tiết Kỹ Năng Chủ Động
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Kế thừa thần vị</span>
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="isExtend"
                      checked={!!formData.isExtend}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 group-hover:after:bg-white transition-colors"></div>
                  </label>
                </div>
              </div>
              <textarea
                name="basicSkill"
                value={formData.basicSkill}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-950/50 border border-white/10 focus:border-blue-500/50 rounded-2xl p-4 text-sm text-slate-300 outline-none transition-all shadow-inner resize-y leading-relaxed"
                placeholder="Mô tả kỹ năng chính của nguyên hồn tâm..."
              />
            </div>

            {/* Star Effects Section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  <Star size={12} className="text-yellow-400" /> Hệ Thống Star Effects (Hiệu Ứng Sao)
                </h4>
                <button
                  type="button"
                  onClick={addStarEffect}
                  className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center gap-1.5 group active:scale-95"
                >
                  <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Thêm Mốc Hiệu Ứng
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence mode="popLayout">
                  {(formData.starEffects || []).map((effect, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex flex-col sm:flex-row gap-4 bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-2xl border border-white/5 transition-all"
                    >
                      <div className="flex gap-4 sm:w-1/3">
                        <div className="flex-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase mb-2 ml-1">Nâng Sao</label>
                          <div className="relative">
                            <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500/50" size={14} />
                            <input
                              type="number"
                              value={effect.star}
                              onChange={(e) => handleStarEffectChange(idx, "star", e.target.value)}
                              className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-yellow-500 font-bold outline-none focus:border-yellow-500/50 transition-all"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase mb-2 ml-1">Cấp Độ</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/50">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                version="1.0"
                                width="14"
                                height="14"
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
                            <input
                              type="number"
                              value={effect.condition}
                              onChange={(e) => handleStarEffectChange(idx, "condition", e.target.value)}
                              className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-blue-400 font-bold outline-none focus:border-blue-500/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 relative">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-2 ml-1">Mô tả Hiệu ứng</label>
                        <div className="flex gap-3">
                          <textarea
                            rows={1}
                            value={effect.description}
                            onChange={(e) => handleStarEffectChange(idx, "description", e.target.value)}
                            className="flex-1 min-h-[42px] bg-slate-950/50 border border-white/10 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-white/20 transition-all resize-y leading-relaxed"
                            placeholder="Nhập nội dung hiệu ứng..."
                          />
                          <button
                            type="button"
                            onClick={() => removeStarEffect(idx)}
                            className="w-10 h-10 shrink-0 flex items-center justify-center text-slate-500 hover:text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-white/5 hover:border-red-500/30 transition-all active:scale-90"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {(!formData.starEffects || formData.starEffects.length === 0) && (
                  <div className="py-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-600 italic text-sm">
                    <Star size={32} className="mb-2 opacity-20" />
                    Chưa có hiệu ứng sao nào được thiết lập
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="px-8 py-5 border-t border-white/5 bg-white/[0.02] flex justify-between items-center gap-4">
            <button
              onClick={() => {
                if(window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
                  onDelete(formData.id);
                }
              }}
              className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 border border-red-500/20 shadow-lg shadow-red-950/20"
            >
              <Trash2 size={16} /> Xóa Dữ Liệu
            </button>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl font-bold text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className="relative overflow-hidden group bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-2xl font-black text-xs shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all active:scale-95 flex items-center gap-2"
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {isSaving ? "ĐANG XỬ LÝ..." : "LƯU THAY ĐỔI"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
