"use client";

import { useState, useRef } from "react";
import {
  FaEdit,
  FaTimes,
  FaSave,
  FaPlus,
  FaTrash,
  FaUpload,
  FaSpinner,
} from "react-icons/fa";
import { SourceSoulHeart, starEffect } from "@/data/types";

const soulMasterTypes = [
  "Cường Công",
  "Mẫn Công",
  "Khống Chế",
  "Phụ Trợ",
  "Phòng Ngự",
];

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

    // Xử lý riêng cho checkbox để đảm bảo giá trị là boolean (true/false)
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

  // Xử lý khi chọn file hình ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Hàm xóa ảnh cũ trên Cloudinary
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

  // Hàm upload ảnh lên Cloudinary qua API Proxy của server
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

  // Xử lý Lưu dữ liệu (Bao gồm Upload Ảnh và Lưu Mongo)
  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      let finalAvatarUrl = formData.avatar;

      // 1. Upload ảnh lên Cloudinary nếu có file mới
      if (imageFile) {
        try {
          const newUrl = await uploadToCloudinary(imageFile, "nguyen-hon-tam");
          if (newUrl) {
            // Nếu tải ảnh mới lên thành công, xóa ảnh cũ (nếu có)
            if (formData.avatar) {
              await deleteCloudinaryImage(formData.avatar);
            }
            finalAvatarUrl = newUrl;
          }
        } catch (uploadError: any) {
          throw new Error(`Cloudinary Error: ${uploadError.message}`);
        }
      }

      const finalData = { ...formData, avatar: finalAvatarUrl };

      // 2. Gửi dữ liệu vào API MongoDB của bạn
      // Đường dẫn /api/source-soul-hearts là ví dụ, bạn cần tạo route này trong app/api/...
      const mongoRes = await fetch("/api/source-soul-hearts", {
        method: item.id ? "PUT" : "POST", // Giả định có ID là Cập nhật, không có là Tạo mới
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

      // 3. Cập nhật giao diện bên ngoài
      onSave(); // Chỉ cần báo cho component cha là đã lưu xong
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Đã xảy ra lỗi trong quá trình lưu");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaEdit className="text-blue-500" /> Chỉnh Sửa Nguyên Hồn Tâm
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-400 transition-colors p-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body Modal (Form) */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID (Readonly) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                ID (Không thể sửa)
              </label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Tên Nguyên Hồn Tâm */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Tên Nguyên Hồn Tâm
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none transition"
              />
            </div>

            {/* Tên Nhân Vật */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Tên Nhân Vật
              </label>
              <input
                type="text"
                name="character"
                value={formData.character}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none transition"
              />
            </div>

            {/* Độ hiếm */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Độ Hiếm
              </label>
              <select
                name="rarity"
                value={formData.rarity}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none transition"
              >
                <option value="SP+">SP+</option>
                <option value="SP">SP</option>
                <option value="SSR+">SSR+</option>
                <option value="SSR">SSR</option>
              </select>
            </div>

            {/* Hệ */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Hệ
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none transition"
              >
                {soulMasterTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Ảnh Avatar */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Link Ảnh Avatar
              </label>
              <div className="flex gap-4 items-center">
                <img
                  src={
                    previewImage ||
                    formData.avatar ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Avatar"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 bg-slate-800 shadow-md"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition"
                    >
                      <FaUpload /> Chọn ảnh từ máy
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="Hoặc dán link ảnh vào đây..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-xs text-white outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chỉ số & Kỹ Năng */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                T.Tính Cơ Bản
              </label>
              <input
                type="text"
                name="basicStat"
                value={formData.basicStat}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Chi tiết kỹ năng
              </label>
              <textarea
                name="basicSkill"
                value={formData.basicSkill}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg p-3 text-sm text-slate-300 outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase">
                  Kế thừa hồn cốt Thần Vị
                </label>
                {/* Nút Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isExtend"
                    checked={!!formData.isExtend}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 border border-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Star Effects */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase">
                Hồn Cốt Hồn Sư
              </label>
              <button
                type="button"
                onClick={addStarEffect}
                className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
              >
                <FaPlus /> Thêm mốc
              </button>
            </div>
            <div className="space-y-2">
              {(formData.starEffects || []).map((effect, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800 sm:items-start"
                >
                  <div className="flex gap-2 w-full sm:w-1/3">
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Mốc Sao
                      </label>
                      <input
                        type="number"
                        value={effect.star}
                        onChange={(e) =>
                          handleStarEffectChange(idx, "star", e.target.value)
                        }
                        className="w-full h-[34px] bg-slate-900 border border-slate-700 rounded px-2 text-xs text-yellow-500 outline-none focus:border-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Cấp nguyên hồn
                      </label>
                      <input
                        type="number"
                        value={effect.condition}
                        onChange={(e) =>
                          handleStarEffectChange(
                            idx,
                            "condition",
                            e.target.value,
                          )
                        }
                        className="w-full h-[34px] bg-slate-900 border border-slate-700 rounded px-2 text-xs text-blue-400 outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex gap-2 items-start w-full">
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 mb-1 hidden sm:block">
                        Mô tả hiệu ứng
                      </label>
                      <textarea
                        rows={1}
                        value={effect.description}
                        onChange={(e) =>
                          handleStarEffectChange(
                            idx,
                            "description",
                            e.target.value,
                          )
                        }
                        className="w-full min-h-[34px] bg-slate-900 border border-slate-700 rounded px-2 py-2 text-xs text-slate-300 outline-none focus:border-slate-500 resize-y leading-tight"
                        placeholder="Mô tả..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] mb-1 hidden sm:block opacity-0 select-none pointer-events-none">
                        X
                      </label>
                      <button
                        type="button"
                        onClick={() => removeStarEffect(idx)}
                        className="h-[34px] w-[34px] shrink-0 flex items-center justify-center text-slate-500 hover:text-red-500 bg-slate-900 rounded border border-slate-700 hover:border-red-500 transition"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <button
            onClick={() => onDelete(formData.id)}
            className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <FaTrash /> Xóa
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
